import express from "express";
import productRouter from "./routes/product.js";
import articleRouter from "./routes/article.js";
import commentRouter from "./routes/comment.js";
import * as dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.js";
import multer from "multer";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
import swaggerUi from "swagger-ui-express";

const app = express();
const upload = multer({ dest: "./uploads/" });
app.use(express.json());
app.use("/files", express.static("uploads"));
app.use(cors());

// Swagger

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "part1-박정은-sprint3",
      description:
        "이 프로젝트는 코드잇 Node js 스프린트의 세번째 미션으로 진행한 프로젝트입니다.",
    },
    servers: [
      {
        url: process.env.SERVER_URL,
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Uploads

app.post("/files", upload.single("attachment"), (req, res) => {
  console.log(req.file);
  const path = `/files/${req.file.filename}`;
  res.json({ path });
});

// Product
app.use("/products", productRouter);

// Article
app.use("/articles", articleRouter);

// Comment
app.use("/comments", commentRouter);

// errorHandler
app.use(errorHandler);

// Listen
app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
  console.log(`mode: ${process.env.NODE_ENV}`);
});
