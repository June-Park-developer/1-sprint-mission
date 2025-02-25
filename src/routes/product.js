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
 * paths:
 *  /products
 *    get:
 *      summary: "상품 데이터 전체조회"
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            { "id": 1, "name": "상품1" },
 *                            { "id": 2, "name": "상품2" },
 *                            { "id": 3, "name": "상품3" },
 *                          ]
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
