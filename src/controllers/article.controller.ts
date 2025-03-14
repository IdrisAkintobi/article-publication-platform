import type { BunRequest, Server } from 'bun';
import { Middleware } from '../middleware/middlewares';
import { ArticleService } from '../services/article.service';
import { BadRequestError } from '../utils/custom.errors';
import {
    validateCreateArticle,
    validateCreateComment,
    validateGetArticle,
    validateUpdateArticle,
    validateUpdateComment,
} from '../validators/article.dto.validator';

const articleController = {
    // Search article
    '/api/article/search': {
        GET: async (req: BunRequest) => {
            const url = new URL(req.url);
            const query = url.searchParams.get('query');
            if (!query) throw new BadRequestError('Query can not be empty');
            const response = await ArticleService.searchArticle(query);
            return Response.json(response);
        },
    },

    // Get article by id
    '/api/article/create': {
        POST: async (req: BunRequest, server: Server) => {
            await Middleware.authenticate(req, server);
            const payload = await req.json();
            const articleData = validateCreateArticle(payload);
            const response = await ArticleService.createArticle(req.authUser.username, articleData);
            return Response.json(response);
        },
    },

    '/api/article/:articleId': {
        // Get article by id
        GET: async (req: BunRequest<'/api/article/:articleId'>) => {
            const { articleId } = validateGetArticle({ articleId: req.params.articleId });
            const response = await ArticleService.findArticleById(articleId);
            return Response.json(response);
        },

        // Update article
        PATCH: async (req: BunRequest<'/api/article/:articleId'>, server: Server) => {
            await Middleware.authenticate(req, server);
            const payload = await req.json();
            const updateArticleData = validateUpdateArticle({ articleId: req.params.articleId, ...payload });
            await ArticleService.updateArticle({
                ...updateArticleData,
                author: req.authUser.id,
            });
            return new Response(null);
        },
    },

    '/api/article/comment/:articleId': {
        // Add comment to article
        POST: async (req: BunRequest<'/api/article/comment/:articleId'>, server: Server) => {
            await Middleware.authenticate(req, server);
            const payload = await req.json();
            const { articleId, comment } = validateCreateComment({ articleId: req.params.articleId, ...payload });
            await ArticleService.addComment(articleId, req.authUser.username, comment);
            return new Response(null, { status: 201 });
        },

        // Update article comment
        PATCH: async (req: BunRequest<'/api/article/:articleId'>, server: Server) => {
            await Middleware.authenticate(req, server);
            const payload = await req.json();
            const updateCommentData = validateUpdateComment(payload);
            await ArticleService.updateComment(
                req.params.articleId,
                updateCommentData.commentId,
                updateCommentData.comment,
            );
            return new Response(null);
        },
    },
};

export { articleController };
