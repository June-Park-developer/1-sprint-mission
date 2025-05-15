import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { RequestHandler } from 'express';
import {
  CreateProductDTO,
  DeleteProductDTO,
  GetProductDTO,
  GetProductListDTO,
  LikeProductDTO,
  UpdateProductDTO,
} from '../DTO/productsDTO';
import * as productsService from '../services/productsService';
import {
  CreateCommentDTO,
  CreateProductCommentDTO,
  GetCommentsForProductDTO,
} from '../DTO/commentsDTO';
import { EntityType } from '../typings/EnumTypes';
import * as commentsService from '../services/commentsService';

export const createProduct: RequestHandler = async (req, res) => {
  const productData = create(req.body, CreateProductBodyStruct);
  const { userId } = req.user!;
  const dto: CreateProductDTO = {
    ...productData,
    authorId: userId,
  };
  const responseProduct = await productsService.createProduct(dto);
  res.status(201).json(responseProduct);
};

export const getProduct: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;
  const dto: GetProductDTO = { productId, userId };
  const responseProduct = await productsService.getProduct(dto);
  res.json(responseProduct);
};

export const updateProduct: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const userId = req.user!.userId;
  const productData = create(req.body, UpdateProductBodyStruct);
  const dto: UpdateProductDTO = { productId, userId, ...productData };
  const responseProduct = await productsService.updateProduct(dto);
  res.send(responseProduct);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const dto: DeleteProductDTO = { productId };
  await productsService.deleteProduct(dto);
  res.status(204).send();
};

export const getProductList: RequestHandler = async (req, res) => {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);
  const userId = req.user?.userId;
  const dto: GetProductListDTO = { userId, page, pageSize, orderBy, keyword };
  const productList = await productsService.getProductList(dto);
  res.send(productList);
};

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

export const createComment: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const authorId = req.user!.userId;
  const dto: CreateProductCommentDTO = {
    productId,
    content,
    authorId,
  };
  const comment = await commentsService.createCommentForProduct(dto);
  res.status(201).send(comment);
};

export const getCommentList: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit = 10 } = create(req.query, GetCommentListParamsStruct);
  const dto: GetCommentsForProductDTO = { productId, cursor, limit };
  const commentsResponse = await commentsService.getCommentsForProduct(dto);
  res.send(commentsResponse);
};
