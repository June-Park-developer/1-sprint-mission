import {
  CreateArticleDTO,
  ArticleResponseDTO,
  UpdateArticleDTO,
  GetArticleListDTO,
  ArticleListResponseDTO,
  LikeArticleDTO,
} from '../DTO/articlesDTO';
import articlesRepository from '../repositories/articlesRepository';
import likedArtriclesRepository from '../repositories/likedArticlesRepository';
import { Article } from '../typings/articleTypes';
import NotFoundError from '../lib/errors/NotFoundError';
import likedArticlesRepository from '../repositories/likedArticlesRepository';

const toArticleResponseDTO = (article: Article, isLiked: boolean = false): ArticleResponseDTO => ({
  id: article.id,
  title: article.title,
  content: article.content,
  image: article.image,
  authorId: article.authorId,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  isLiked,
});

const createArticle = async (articleData: CreateArticleDTO) => {
  const createdArticle = await articlesRepository.create(articleData);
  return toArticleResponseDTO(createdArticle);
};

const getArticle = async (articleId: number, userId?: number) => {
  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  const isLiked = userId ? !!(await likedArtriclesRepository.getLike(userId, articleId)) : false;
  return toArticleResponseDTO(article, isLiked);
};

const updateArticle = async (articleId: number, updateData: UpdateArticleDTO) => {
  const article = await articlesRepository.update(articleId, updateData);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  const responseArticle = toArticleResponseDTO(article);
  return responseArticle;
};

const deleteArticle = async (articleId: number) => {
  const existingArticle = await articlesRepository.getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  await articlesRepository.deleteById(articleId);
};

const getArticleList = async (params: GetArticleListDTO, userId?: number) => {
  const totalCount = await articlesRepository.countByKeyword(params.keyword);
  const articles = await articlesRepository.getArticleList(params);

  const list = await Promise.all(
    articles.map(async (article) => {
      if (userId) {
        const liked = await likedArtriclesRepository.getLike(userId, article.id);
        return toArticleResponseDTO(article, !!liked);
      }
      return toArticleResponseDTO(article);
    }),
  );

  const response: ArticleListResponseDTO = { list, totalCount };
  return response;
};

const likeArticle = async (dto: LikeArticleDTO) => {
  const { userId, articleId } = dto;
  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  const existingLikedArticle = await likedArticlesRepository.getLike(userId, articleId);
  if (existingLikedArticle) {
    await likedArticlesRepository.deleteLike(userId, articleId);
    return false;
  } else {
    await likedArticlesRepository.createLike(userId, articleId);
    return true;
  }
};

export default {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  getArticleList,
  likeArticle,
};
