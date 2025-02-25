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
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: 상품의 ID
 *         name:
 *           type: string
 *           description: 상품의 이름
 *         description:
 *           type: string
 *           description: 상품 설명
 *         price:
 *           type: number
 *           format: float
 *           description: 상품의 가격
 *         stock:
 *           type: integer
 *           description: 상품 재고 수량
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 상품 생성 시간
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: 상품 등록
 *     description: 새로운 상품을 등록한다.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 상품의 이름
 *               description:
 *                 type: string
 *                 description: 상품의 설명 (선택적)
 *               tags:
 *                 type: string
 *                 enum: [FASHION, BEAUTY, SPORTS, ELECTRONICS, HOME_INTERIOR, HOUSEHOLD_SUPPLIES, KITCHENWARE, ETC]
 *                 description: 상품의 태그
 *               price:
 *                 type: number
 *                 description: 상품의 가격
 *               stock:
 *                 type: integer
 *                 description: 상품의 재고 수량
 *     responses:
 *       201:
 *         description: 상품이 성공적으로 등록됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
