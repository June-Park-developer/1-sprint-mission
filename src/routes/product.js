import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  validateCreateProduct,
  validatePatchProduct,
} from "../middlewares/validation.js";
import productCommentRouter from "./productComment.js";

const productRouter = express.Router();

// To-do : validateCreateProduct 정의 하고 post에 쓰기
// To-do : validatePatchProduct 정의하고 patch 에 쓰기
// ? : status를 여기서 정의해야 하나?
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
