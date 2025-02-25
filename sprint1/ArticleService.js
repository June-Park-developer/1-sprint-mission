import axios from "axios";
import handleError from "./utils.js";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/articles",
});

// getArticleList
function getArticleList(page, pageSize, keyword) {
  let list = instance
    .get("", {
      params: {
        page,
        pageSize,
        keyword,
      },
    })
    .then((res) => {
      return res.data.list;
    })
    .catch((error) => handleError(error, "getArticleList"));
  return list;
}
// getArticle : 해당 id의 data 반환
function getArticle(id) {
  let data = instance
    .get(`/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => handleError(error, "getArticle"));
  return data;
}

// createArticle : post 후 id 반환
function createArticle(title, content, image) {
  let id = instance
    .post("", {
      title,
      content,
      image,
    })
    .then((res) => {
      return res.data.id;
    })
    .catch((error) => handleError(error, "createArticle"));
  return id;
}

// patchArticle : patch 후 id 반환
function patchArticle(articleId, title, content, image) {
  let patchedId = instance
    .patch(`/${articleId}`, {
      title,
      content,
      image,
    })
    .then((res) => {
      return res.data.id;
    })
    .catch((error) => handleError(error, "patchArticle"));
  return patchedId;
}

// deleteArticle : delete 후 지워진 id 반환
function deleteArticle(id) {
  let deletedArticleId = instance
    .delete(`/${id}`)
    .then((res) => {
      return res.data.id;
    })
    .catch((error) => handleError(error, "deleteArticle"));
  return deletedArticleId;
}

export default {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
};
