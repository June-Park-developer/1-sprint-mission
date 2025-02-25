import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  validateCreateComment,
  validatePatchComment,
} from "../middlewares/validation.js";

const articleCommentRouter = express.Router();
articleCommentRouter.route("/").get(
  asyncHandler(async (req, res) => {
    const { cursor: myCursor, limit = 10 } = req.query;
    const comments = await prisma.comment.findMany({
      where: { article: { isNot: null } },
      cursor: myCursor ? { id: parseInt(myCursor) } : undefined,
      skip: myCursor ? 1 : 0,
      take: parseInt(limit),
      orderBy: { id: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1].id : null;
    res.json({ comments, nextCursor });
  })
);

articleCommentRouter
  .route("/:articleId")
  .post(
    validateCreateComment,
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const comment = await prisma.comment.create({
        data: {
          ...req.body,
          article: {
            connect: { id: articleId },
          },
        },
      });
      res.status(201).json(comment);
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const comments = await prisma.comment.findMany({
        where: { articleId },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
      res.json(comments);
    })
  );

export default articleCommentRouter;
