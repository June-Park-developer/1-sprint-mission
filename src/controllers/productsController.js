import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ConflictError from '../lib/errors/ConflictError.js';
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

export async function createProduct(req, res) {
  const { name, description, price, tags, images } = create(req.body, CreateProductBodyStruct);
  const userId = req.user.userId;
  const data = { name, description, price, tags, images };
  data.authorId = userId;
  const product = await productsRepository.create(data);

  res.status(201).send(product);
}

export async function getProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productsRepository.getById(id);
  if (!product) {
    throw new NotFoundError('product', id);
  }
  return res.send(product);
}

export async function updateProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  console.log(id);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);
  const data = { name, description, price, tags, images };

  const existingProduct = await productsRepository.getById(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  const updatedProduct = await productsRepository.update(id, data);

  return res.send(updatedProduct);
}

export async function deleteProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const existingProduct = await productsRepository.getById(id);

  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  await productsRepository.deleteById(id);

  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const totalCount = await productsRepository.countByKeyword(keyword);
  const products = await productsRepository.getProductList({ page, pageSize, orderBy, keyword });

  return res.send({
    list: products,
    totalCount,
  });
}

export async function getMyProductList(req, res) {
  const { userId: authorId } = req.user;
  const { page, pageSize, orderBy } = create(req.query, GetMyProductsParamsStruct);
  const totalCount = await productsRepository.countByAuthorId(authorId);
  const products = await productsRepository.getMyProductList({
    authorId,
    page,
    pageSize,
    orderBy,
  });
  return res.send({
    list: products,
    totalCount,
  });
}

// Comment
export async function createComment(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const authorId = req.user.userId;
  const data = { productId, content, authorId };

  const existingProduct = await productsRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const comment = await commentsRepository.create(data);

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await productsRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const commentsWithCursorComment = await commentsRepository.getCommentsForProduct(
    productId,
    limit,
    cursor,
  );

  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

// Like, Unlike
export async function likeProduct(req, res) {
  const { userId } = req.user;
  const { id: productId } = create(req.params, IdParamsStruct);
  const existingLikedProduct = await likedProductsRepository.getLike(userId, productId);
  if (existingLikedProduct) {
    throw new ConflictError('like');
  }
  await likedProductsRepository.createLike(userId, productId);
  return res.status(201).json({ message: 'Product liked successfully' });
}

export async function unlikeProduct(req, res) {
  const { userId } = req.user;
  const { id: productId } = create(req.params, IdParamsStruct);
  const existingLikedProduct = await likedProductsRepository.getLike(userId, productId);
  if (!existingLikedProduct) {
    throw new NotFoundError('likedProduct', userId);
  }
  await likedProductsRepository.deleteLike(userId, productId);
  return res.status(204).json({ message: 'Product unliked successfully' });
}
