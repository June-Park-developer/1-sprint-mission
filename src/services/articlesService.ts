import { CreateArticleDTO, ArticleResponseDTO, UpdateArticleDTO } from '../DTO/articlesDTO';
import articlesRepository from '../repositories/articlesRepository';
import likedArtriclesRepository from '../repositories/likedArtriclesRepository';
import { Article, GetArticleListParamsInput } from '../typings/articleTypes';
import NotFoundError from '../lib/errors/NotFoundError';

const toResponseArticleDTO = (article: Article): ArticleResponseDTO => ({
  id: article.id,
  title: article.title,
  content: article.content,
  image: article.image,
  authorId: article.authorId,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  isLiked: article.isLiked || false,
});

const createArticle = async (data: CreateArticleDTO) => {
  const article = await articlesRepository.create(data);
  const result = toResponseArticleDTO(article);
  return result;
};

const getArticle = async (articleId: number, userId: number) => {
  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  const likedArticle = await likedArtriclesRepository.getLike(userId, articleId);
  article.isLiked = !!likedArticle;
  const result = toResponseArticleDTO(article);
  return result;
};

const updateArticle = async (articleId: number, data: UpdateArticleDTO) => {
  const article = await articlesRepository.update(articleId, data);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  const result = toResponseArticleDTO(article);
  return result;
};

const deleteArticle = async (articleId: number) => {
  const existingArticle = await articlesRepository.getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  await articlesRepository.deleteById(articleId);
};

const getArticleList = async (params: GetArticleListParamsInput) => {
  const totalCount = await articlesRepository.countByKeyword(params.keyword);
  const articles = await articlesRepository.getArticleList(params);
  const list = articles.map((article) => toResponseArticleDTO(article));
  const result = { list, totalCount };
  return result;
};

export default { createArticle, getArticle, updateArticle, deleteArticle, getArticleList };
