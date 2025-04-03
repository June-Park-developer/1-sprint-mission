import {
  CreateArticleDTO,
  ArticleResponseDTO,
  UpdateArticleDTO,
  GetArticleListDTO,
  ArticleListResponseDTO,
  LikeArticleDTO,
  GetArticleDTO,
  DeleteArticleDTO,
} from '../DTO/articlesDTO';
import articlesRepository from '../repositories/articlesRepository';
import likedArtriclesRepository from '../repositories/likedArticlesRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import likedArticlesRepository from '../repositories/likedArticlesRepository';

const createArticle = async (dto: CreateArticleDTO) => {
  const createdArticle = await articlesRepository.create(dto);
  const article = new ArticleResponseDTO(createdArticle);
  return article;
};

const getArticle = async (dto: GetArticleDTO) => {
  const { articleId, userId } = dto;
  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  if (userId) {
    const isLiked = !!(await likedArticlesRepository.getLike(userId, articleId));
    return new ArticleResponseDTO(article, isLiked);
  } else {
    return new ArticleResponseDTO(article);
  }
};

const updateArticle = async (dto: UpdateArticleDTO) => {
  const { articleId, userId, ...articleData } = dto;
  const article = await articlesRepository.update(articleId, articleData);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  const isLiked = !!(await likedArticlesRepository.getLike(userId, articleId));
  return new ArticleResponseDTO(article, isLiked);
};

const deleteArticle = async (dto: DeleteArticleDTO) => {
  const { articleId } = dto;
  const existingArticle = await articlesRepository.getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  await articlesRepository.deleteById(articleId);
};

const getArticleList = async (dto: GetArticleListDTO) => {
  const { userId, ...params } = dto;
  const totalCount = await articlesRepository.countByKeyword(params.keyword);
  const articles = await articlesRepository.getArticleList(params);

  const list = await Promise.all(
    articles.map(async (article) => {
      if (userId) {
        const liked = await likedArtriclesRepository.getLike(userId, article.id);
        return new ArticleResponseDTO(article, !!liked);
      }
      return new ArticleResponseDTO(article);
    }),
  );

  return new ArticleListResponseDTO(list, totalCount);
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
