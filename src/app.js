import express from "express";
import productRouter from "./routes/product.js";
import articleRouter from "./routes/article.js";
import commentRouter from "./routes/comment.js";
import * as dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.js";
import multer from "multer";
import cors from "cors";

dotenv.config();
const app = express();
const upload = multer({ dest: "./uploads/" });
app.use(express.json());
app.use("/files", express.static("uploads"));
app.use(cors());

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

// 해당하는 미들웨어가 없는 경우 에러 발생
app.use((req, res, next) => {
  const error = new Error();
  error.name = "NoMatchingRouter";
  next(error);
});

// errorHandler
app.use(errorHandler);

// Listen
app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
});
