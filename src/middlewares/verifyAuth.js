import { getById } from '../repositories/articlesRepository.js';

async function verifyArticleAuth(req, res, next) {
  const { userId } = req.user;
  const { id: articleId } = req.params;
  const article = await getById(articleId);
  if (article.authorId === userId) {
  }
}
