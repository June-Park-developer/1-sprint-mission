import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError';
import ConflictError from '../lib/errors/ConflictError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetMyProductsParamsStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import productsRepository from '../repositories/productsRepository';
import commentsRepository from '../repositories/commentsRepository';
import likedProductsRepository from '../repositories/likedProductsRepository';
import { RequestHandler } from 'express';
import { CreateProductDTO } from '../DTO/productsDTO';
import productsService from '../services/productsService';
import { CreateCommentDTO, GetCommentsForProductDTO } from '../DTO/commentsDTO';
import { EntityType } from '../typings/EnumTypes';
import commentsService from '../services/commentsService';

export const createProduct: RequestHandler = async (req, res) => {
  const parsed = create(req.body, CreateProductBodyStruct);
  const { userId } = req.user!;
  const productData: CreateProductDTO = {
    ...parsed,
    authorId: userId,
  };
  const responseProduct = await productsService.createProduct(productData);
  res.status(201).json(responseProduct);
};

export const getProduct: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;
  const responseProduct = await productsService.getProduct(productId, userId);
  res.json(responseProduct);
};

export const updateProduct: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const productData = create(req.body, UpdateProductBodyStruct);
  const responseProduct = await productsService.updateProduct(productId, productData);
  res.send(responseProduct);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  await productsService.deleteProduct(productId);
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
  const { userId: authorId } = req.user!;
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
  const authorId = req.user!.userId;
  const dto: CreateCommentDTO = {
    entityName: EntityType.Product,
    productId,
    content,
    authorId,
  };
  const comment = await commentsService.createComment(dto);
  res.status(201).send(comment);
};

export const getCommentList: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit = 10 } = create(req.query, GetCommentListParamsStruct);
  const dto: GetCommentsForProductDTO = { productId, cursor, limit };
  const commentsResponse = await commentsService.getCommentsForProduct(dto);
  res.send(commentsResponse);
};

// Like, Unlike
export const likeProduct: RequestHandler = async (req, res) => {
  const { userId } = req.user!;
  const { id: productId } = create(req.params, IdParamsStruct);
  const existingLikedProduct = await likedProductsRepository.getLike(userId, productId);
  if (existingLikedProduct) {
    throw new ConflictError('like');
  }
  await likedProductsRepository.createLike(userId, productId);
  res.status(201).json({ message: 'Product liked successfully' });
};

export const unlikeProduct: RequestHandler = async (req, res) => {
  const { userId } = req.user!;
  const { id: productId } = create(req.params, IdParamsStruct);
  const existingLikedProduct = await likedProductsRepository.getLike(userId, productId);
  if (!existingLikedProduct) {
    throw new NotFoundError(`This product is not liked by user ${userId}`);
  }
  await likedProductsRepository.deleteLike(userId, productId);
  res.status(204).json({ message: 'Product unliked successfully' });
};
