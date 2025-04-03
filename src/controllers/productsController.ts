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
import { CreateProductDTO, GetProductListDTO, LikeProductDTO } from '../DTO/productsDTO';
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
  const userId = req.user?.userId;
  const dto: GetProductListDTO = { userId, page, pageSize, orderBy, keyword };
  const productList = await productsService.getProductList(dto);
  res.send(productList);
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
  const dto: LikeProductDTO = { userId, productId };
  const isLiked = await productsService.likeProduct(dto);
  if (isLiked) {
    res.status(201).json({ message: 'Product liked successfully' });
  } else {
    res.status(204).json({ message: 'Product unliked successfuly' });
  }
};
