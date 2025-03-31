import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError';
import ConflictError from '../lib/errors/ConflictError';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateProductBodyStruct,
  GetMyProductsParamsStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import productsRepository from '../repositories/productsRepository.js';
import commentsRepository from '../repositories/commentsRepository.js';
import likedProductsRepository from '../repositories/likedProductsRepository.js';
import { Request, RequestHandler, Response } from 'express';

export const createProduct: RequestHandler = async (req, res) => {
  const parsed = create(req.body, CreateProductBodyStruct);
  const userId = req.user?.userId;
  const data = {
    ...parsed,
    authorId: userId,
  };
  const product = await productsRepository.create(data);

  res.status(201).send(product);
};

export const getProduct: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const product = await productsRepository.getById(productId);
  if (!product) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  const { userId } = req.user || {};
  let isLiked = false;
  if (userId) {
    const likedProduct = await likedProductsRepository.getLike(userId, productId);
    isLiked = likedProduct ? true : false;
  }
  res.send({ ...product, isLiked });
};

export const updateProduct: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);
  const data = { name, description, price, tags, images };

  const existingProduct = await productsRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }

  const updatedProduct = await productsRepository.update(productId, data);

  res.send(updatedProduct);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const existingProduct = await productsRepository.getById(productId);

  if (!existingProduct) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }

  await productsRepository.deleteById(productId);

  res.status(204).send();
};

export const getProductList: RequestHandler = async (req, res) => {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const totalCount = await productsRepository.countByKeyword(keyword);
  const products = await productsRepository.getProductList({ page, pageSize, orderBy, keyword });

  res.send({
    list: products,
    totalCount,
  });
};

export const getMyProductList: RequestHandler = async (req, res) => {
  const { userId: authorId } = req.user || {};
  const { page, pageSize, orderBy } = create(req.query, GetMyProductsParamsStruct);
  const totalCount = await productsRepository.countByAuthorId(authorId);
  const products = await productsRepository.getMyProductList({
    authorId,
    page,
    pageSize,
    orderBy,
  });
  res.send({
    list: products,
    totalCount,
  });
};

// Comment
export const createComment: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const authorId = req.user?.userId;
  const data = { productId, content, authorId };

  const existingProduct = await productsRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }

  const comment = await commentsRepository.create(data);

  res.status(201).send(comment);
};

export const getCommentList: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await productsRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }

  const commentsWithCursorComment = await commentsRepository.getCommentsForProduct(
    productId,
    limit,
    cursor,
  );

  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send({
    list: comments,
    nextCursor,
  });
};

// Like, Unlike
export const likeProduct: RequestHandler = async (req, res) => {
  const { userId } = req.user || {};
  const { id: productId } = create(req.params, IdParamsStruct);
  const existingLikedProduct = await likedProductsRepository.getLike(userId, productId);
  if (existingLikedProduct) {
    throw new ConflictError('like');
  }
  await likedProductsRepository.createLike(userId, productId);
  res.status(201).json({ message: 'Product liked successfully' });
};

export const unlikeProduct: RequestHandler = async (req, res) => {
  const { userId } = req.user || {};
  const { id: productId } = create(req.params, IdParamsStruct);
  const existingLikedProduct = await likedProductsRepository.getLike(userId, productId);
  if (!existingLikedProduct) {
    throw new NotFoundError(`This product is not liked by user ${userId}`);
  }
  await likedProductsRepository.deleteLike(userId, productId);
  res.status(204).json({ message: 'Product unliked successfully' });
};
