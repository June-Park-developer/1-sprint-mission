import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  validateCreateArticle,
  validatePatchArticle,
} from "../middlewares/validation.js";
import articleCommentRouter from "./articleComment.js";

const articleRouter = express.Router();

// To-do : validateCreateArticle 만들고 post에 넣기
// To-do : validatePatchArticle 만들고 patch 에 넣기
articleRouter
  .route("/")
  .post(
    validateCreateArticle,
    asyncHandler(async (req, res) => {
      const article = await prisma.article.create({
        data: req.body,
      });
      res.status(201).json(article);
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
        case "recent":
        default:
          orderBy = { createdAt: "desc" };
          break;
      }
      const where = search
        ? {
            OR: [
              { title: { contains: search } },
              { content: { contains: search } },
            ],
          }
        : {};
      const articles = await prisma.article.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy,
        where,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });
      res.json(articles);
    })
  );

articleRouter.use("/comments", articleCommentRouter);
articleRouter
  .route("/:articleId")
  .get(
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const article = await prisma.article.findUniqueOrThrow({
        where: { id: articleId },
      });
      res.json(article);
    })
  )
  .patch(
    validatePatchArticle,
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const article = await prisma.article.update({
        where: { id: articleId },
        data: req.body,
      });
      res.json(article);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      await prisma.article.delete({
        where: { id: articleId },
      });
      res.json({ message: "삭제가 잘 되었습니다~" });
    })
  );
export default articleRouter;
