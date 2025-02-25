import axios from "axios";
import handleError from "./utils.js";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/products",
});

// getProductList : 해당 조건 get 하여 list 반환
async function getProductList(page, pageSize, keyword) {
  let res;
  try {
    res = await instance.get("", {
      params: {
        page,
        pageSize,
        keyword,
      },
    });
  } catch (error) {
    handleError(error, "getProductList");
  }
  return res.data.list;
}

// getProduct : 해당 id의 data 반환
async function getProduct(id) {
  let res;
  try {
    res = await instance.get(`/${id}`);
  } catch (error) {
    handleError(error, "getProduct");
  }
  return res.data;
}

// createProduct : 포스트 후 id 반환
async function createProduct(images, tags, price, description, name) {
  let res;
  try {
    res = await instance.post("", {
      images,
      tags,
      price,
      description,
      name,
    });

    if (res.status < 200 || res.status > 300) {
      throw new Error("res 문제.");
    }
  } catch (error) {
    handleError(error, "createProduct");
  }
  return res.data.id;
}

// patchProduct : patch 후 id 반환
async function patchProduct(id, images, tags, price, description, name) {
  let res;
  try {
    res = await instance.patch(`/${id}`, {
      images,
      tags,
      price,
      description,
      name,
    });
  } catch (error) {
    handleError(error, "patchProduct");
  }
  return res.data.id;
}

// deleteProduct : 지운 후 성공 시 삭제된 id 반환
async function deleteProduct(id) {
  let res;
  try {
    res = await instance.delete(`/${id}`);
  } catch (error) {
    handleError(error, "deleteProduct");
  }
  return res.data.id;
}

export default {
  getProductList,
  getProduct,
  patchProduct,
  createProduct,
  deleteProduct,
};
