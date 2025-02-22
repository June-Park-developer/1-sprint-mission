import Product from "./Product.js";
import ElectronicProduct from "./ElectronicProduct.js";
import Article from "./Article.js";

import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";

import {
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
  getArticleList,
} from "./ArticleService.js";

// Product
console.log("=== Product ===");

// createProduct
console.log("--- createProduct + getProduct ---");

const productId = await createProduct(
  ["https://www.examples.com"],
  ["전자제품"],
  2000,
  "애플 패드",
  "아이패드"
);

// getProduct
const productData = await getProduct(productId);
console.log(productData);

// patchProduct
console.log("--- patchProduct ---");

const patchedProductId = await patchProduct(
  productId,
  ["https://www.patched.com"],
  ["전자제품"],
  3000,
  "패치했습니다.",
  "아이패드 패치"
);
const patchedProduct = await getProduct(patchedProductId);
console.log(patchedProduct);

// deleteProduct
console.log("--- deleteProduct ---");

const deletedProductId = await deleteProduct(patchedProductId);
console.log(deletedProductId);

// getProductList
console.log("--- getProductList ---");
const productList = await getProductList(1, 2, "패드");
console.log(productList);
// Product의 리스트로 변형

console.log("--- Product와 ElectronicProduct의 배열로 변환 ---");
const products = productList.map((product) => {
  if (product.tags.includes("전자제품")) {
    return new ElectronicProduct(
      product.name,
      product.description,
      product.price,
      product.tags,
      product.images
    );
  } else {
    return new Product(
      product.name,
      product.description,
      product.price,
      product.tags,
      product.images
    );
  }
});
console.log(products);

// Article
console.log("=== Article ===");
// createArticle + getArticle
console.log("--- createArticle + getArticle ---");
const articleId = await createArticle(
  "샘플 기사",
  "샘플 기사엔 샘플이 있습니다.",
  "https://www.example.com"
);
const articleData = await getArticle(articleId);
console.log(articleData);

// patchArticle
console.log("--- patchArticle ---");
const patchedArticleId = await patchArticle(
  articleId,
  "패치 기사",
  "패치되었습니다.",
  "https://www.example.com"
);
const patchedArticle = await getArticle(patchedArticleId);
console.log(patchedArticle);

// deleteArticle
console.log("--- deleteArticle ---");
const deletedArticleId = await deleteArticle(patchedArticleId);
console.log(deletedArticleId);

// getArticleList
console.log("--- getArticleList ---");
const articleList = await getArticleList(1, 2, "기사");
console.log(articleList);

// Article의 리스트로 변경
const articles = articleList.map((article) => {
  return new Article(article.title, article.content, article.image);
});
console.log(articles);
