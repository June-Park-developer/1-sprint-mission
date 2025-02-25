import * as s from "superstruct";

const CreateProduct = s.object({
  name: s.size(s.string(), 3, 20),
  description: s.optional(s.size(s.string(), 0, 1000)),
  tags: s.optional(
    s.enums([
      "FASHION",
      "BEAUTY",
      "SPORTS",
      "ELECTRONICS",
      "HOME_INTERIOR",
      "HOUSEHOLD_SUPPLIES",
      "KITCHENWARE",
    ])
  ),
  price: s.min(s.number(), 0),
  stock: s.min(s.number(), 0),
  createdAt: s.optional(s.date()),
  updatedAt: s.optional(s.date()),
});

const PatchProduct = s.partial(CreateProduct);

const CreateArticle = s.object({
  title: s.size(s.string(), 3, 20),
  content: s.size(s.string(), 0, 1000),
  createdAt: s.optional(s.date()),
  updatedAt: s.optional(s.date()),
});

const PatchArticle = s.partial(CreateArticle);

const CreateComment = s.object({
  content: s.size(s.string(), 0, 300),
  createdAt: s.optional(s.date()),
  updatedAt: s.optional(s.date()),
});

const PatchComment = s.partial(CreateComment);

export default {
  CreateProduct,
  PatchProduct,
  CreateArticle,
  PatchArticle,
  CreateComment,
  PatchComment,
};
