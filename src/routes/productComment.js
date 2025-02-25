import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  validateCreateComment,
  validatePatchComment,
} from "../middlewares/validation.js";

const productCommentRouter = express.Router();
productCommentRouter.route("/").get(
  asyncHandler(async (req, res) => {
    const { cursor: myCursor, limit = 10 } = req.query;
    const comments = await prisma.comment.findMany({
      where: { product: { isNot: null } },
      cursor: myCursor ? { timeStamp: parseInt(myCursor) } : undefined,
      skip: myCursor ? 1 : 0,
      take: parseInt(limit),
      orderBy: { timeStamp: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1].timeStamp : null;
    res.json({ comments, nextCursor });
  })
);

productCommentRouter
  .route("/:productId")
  .post(
    validateCreateComment,
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const comment = await prisma.comment.create({
        data: {
          ...req.body,
          product: {
            connect: { id: productId },
          },
        },
      });
      res.status(201).json(comment);
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const comments = await prisma.comment.findMany({
        where: { productId },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
      res.json(comments);
    })
  );

export default productCommentRouter;
