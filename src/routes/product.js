import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  validateCreateProduct,
  validatePatchProduct,
} from "../middlewares/validation.js";
import productCommentRouter from "./productComment.js";

const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 상품 관련 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: "고유 ID (UUID)"
 *           example: "b13c2e6f-dc44-4b97-bad7-cf602a90322b"
 *         name:
 *           type: string
 *           description: 상품 이름
 *           example: "블루 티셔츠"
 *         description:
 *           type: string
 *           description: 상품 설명
 *           example: "편안한 착용감을 제공하는 블루 티셔츠"
 *         tags:
 *           type: string
 *           description: "상품의 태그 (기본값: ETC)"
 *           example: "ETC"
 *         price:
 *           type: number
 *           format: float
 *           description: 상품 가격
 *           example: 29.99
 *         stock:
 *           type: integer
 *           description: 재고 수량
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성된 날짜 및 시간
 *           example: "2025-02-26T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 마지막으로 업데이트된 날짜 및 시간
 *           example: "2025-02-26T12:00:00Z"
 *         Comment:
 *           type: array
 *           description: 상품에 대한 댓글
 *           items:
 *             $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: 새로운 상품 생성
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: 생성된 상품 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: 잘못된 요청
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *         description: "조회할 상품의 시작 위치 (기본값: 0)"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: "조회할 상품의 수 (기본값: 10)"
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - recent
 *             - oldest
 *             - priceLowest
 *             - priceHighest
 *           example: recent
 *         description: 상품을 정렬할 방식
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: "블루 티셔츠"
 *         description: 상품을 검색할 키워드
 *     responses:
 *       200:
 *         description: 상품 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: 잘못된 요청
 */

productRouter
  .route("/")
  .post(
    validateCreateProduct,
    asyncHandler(async (req, res) => {
      const product = await prisma.product.create({
        data: req.body,
      });
      res.status(201).json(product);
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order, search } = req.query;
      let orderBy;
      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "priceLowest":
          orderBy = { price: "asc" };
          break;
        case "priceHighest":
          orderBy = { price: "desc" };
          break;
        case "recent":
        default:
          orderBy = { createdAt: "desc" };
          break;
      }
      const where = search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {};
      const products = await prisma.product.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy,
        where,
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      });
      res.status(201).json(products);
    })
  );

productRouter.use("/comments", productCommentRouter);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: 특정 상품 정보 조회
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 상품의 고유 ID
 *     responses:
 *       200:
 *         description: 조회된 상품 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 상품을 찾을 수 없음
 *   patch:
 *     summary: 특정 상품 정보 수정
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 상품의 고유 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: 수정된 상품 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 상품을 찾을 수 없음
 *   delete:
 *     summary: 특정 상품 삭제
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 상품의 고유 ID
 *     responses:
 *       200:
 *         description: 삭제된 상품 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 상품을 찾을 수 없음
 */

productRouter
  .route("/:productId")
  .get(
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const product = await prisma.product.findUniqueOrThrow({
        where: {
          id: productId,
        },
      });
      res.json(product);
    })
  )
  .patch(
    validatePatchProduct,
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const product = await prisma.product.update({
        where: { id: productId },
        data: req.body,
      });
      res.json(product);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const product = await prisma.product.delete({
        where: { id: productId },
      });
      res.json(product);
    })
  );

export default productRouter;
