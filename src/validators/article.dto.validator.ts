import { type } from 'arktype';
import { mongoIDType, validate } from './validator';

const createArticleType = type({
    title: 'string>10',
    content: 'string>20',
});
export type CreateArticleDTO = typeof createArticleType.infer;
export const validateCreateArticle = validate(createArticleType);

const getArticleType = type({
    articleId: mongoIDType, //Mongodb id regex
});
export const validateGetArticle = validate(getArticleType);

const updateArticleType = type({
    '...': getArticleType,
    title: 'string>10',
    content: 'string>20',
});
export type UpdateArticleDTO = typeof updateArticleType.infer;
export const validateUpdateArticle = validate(updateArticleType);

const createCommentType = type({
    articleId: mongoIDType,
    comment: 'string>0',
});
export type CreateCommentDTO = typeof createCommentType.infer;
export const validateCreateComment = validate(createCommentType);

const updateCommentType = type({
    commentId: 'string.hex',
    comment: 'string',
});
export type UpdateCommentDTO = typeof updateCommentType.infer;
export const validateUpdateComment = validate(updateCommentType);
