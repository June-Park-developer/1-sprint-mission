import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  validateCreateComment,
  validatePatchComment,
} from "../middlewares/validation.js";

const commentRouter = express.Router();

commentRouter
  .route("/:commentId")
  .get(
    asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      const comment = await prisma.comment.findUniqueOrThrow({
        where: { id: commentId },
      });
      res.json(comment);
    })
  )
  .patch(
    validatePatchComment,
    asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: req.body,
      });
      res.json(comment);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      const comment = await prisma.comment.delete({
        where: { id: commentId },
      });
      res.json({ message: "성공적으로 삭제~" });
    })
  );

export default commentRouter;
