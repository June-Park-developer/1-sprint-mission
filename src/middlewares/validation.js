import struct from "../utils/struct.js";
import * as s from "superstruct";

export function validateCreateProduct(req, res, next) {
  try {
    s.assert(req.body, struct.CreateProduct);
    next();
  } catch (err) {
    next(err);
  }
}

export function validatePatchProduct(req, res, next) {
  try {
    s.assert(req.body, struct.PatchProduct);
    next();
  } catch (err) {
    next(err);
  }
}

export function validateCreateArticle(req, res, next) {
  try {
    s.assert(req.body, struct.CreateArticle);
    next();
  } catch (err) {
    next(err);
  }
}

export function validatePatchArticle(req, res, next) {
  try {
    s.assert(req.body, struct.PatchArticle);
    next();
  } catch (err) {
    next(err);
  }
}

export function validateCreateComment(req, res, next) {
  try {
    s.assert(req.body, struct.CreateComment);
    next();
  } catch (err) {
    next(err);
  }
}

export function validatePatchComment(req, res, next) {
  try {
    s.assert(req.body, struct.PatchComment);
    next();
  } catch (err) {
    next(err);
  }
}
