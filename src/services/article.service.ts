import { Article } from '../database/schema/article.schema';
import { ConflictError, NotFoundError } from '../utils/custom.errors';
import { eSClient } from '../utils/elasticsearch.client';
import { logger } from '../utils/logger';
import type { CreateArticleDTO, UpdateArticleDTO } from '../validators/article.dto.validator';

export class ArticleService {
    private static articleIndex = Bun.env.MONGO_DATABASE + '.' + Bun.env.ARTICLE_COLLECTION;

    // Search articles with Elasticsearch and pagination
    public static searchArticle = async (query: string, page: number = 1, limit: number = 10) => {
        try {
            const from = (page - 1) * limit; // Offset for pagination

            const result = await eSClient.search({
                index: this.articleIndex,
                from,
                size: limit,
                query: {
                    multi_match: {
                        query,
                        fields: ['title^3', 'content'],
                    },
                },
            });

            // Ensure total is handled correctly
            const totalHits = typeof result.hits.total === 'number' ? result.hits.total : result.hits.total?.value || 0;

            return {
                articles: result.hits.hits,
                totalArticles: totalHits,
                totalPages: Math.ceil(totalHits / limit),
                currentPage: page,
            };
        } catch (error) {
            logger.error(error, 'Error searching articles');
            throw new Error('Failed to search articles');
        }
    };

    // Find an article by ID
    public static findArticleById = async (articleId: string) => {
        const article = await Article.findById(articleId);
        if (!article) throw new NotFoundError('Article not found');
        return article;
    };

    // Create a new article
    public static createArticle = async (author: string, createArticleData: CreateArticleDTO) => {
        const articleExist = await Article.findOne({ author, title: createArticleData.title });
        if (articleExist) throw new ConflictError('Article with the title already exist');
        const newArticle = new Article({ ...createArticleData, author });
        return (await newArticle.save()).toObject();
    };

    // Update an article
    public static updateArticle = async (updateData: UpdateArticleDTO & { author: string }) => {
        const { author, articleId, ...updatedData } = updateData;
        const updatedArticle = await Article.findByIdAndUpdate({ articleId, author }, updatedData, {
            new: true,
            runValidators: true,
            lean: true,
        });
        if (!updatedArticle) throw new NotFoundError('Article not found');
    };

    // Delete an article
    public static deleteArticle = async (articleId: string) => {
        const deletedArticle = await Article.findByIdAndDelete(articleId);
        if (!deletedArticle) throw new NotFoundError('Article not found');
    };

    // Get all articles with pagination
    public static getArticles = async (filter = {}, page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;

        const articles = await Article.find(filter).skip(skip).limit(limit);

        const totalArticles = await Article.countDocuments(filter);

        return {
            articles,
            totalArticles,
            totalPages: Math.ceil(totalArticles / limit),
            currentPage: page,
        };
    };

    /**
     * Comment section
     */

    public static addComment = async (articleId: string, username: string, comment: string) => {
        await Article.findOneAndUpdate(
            { _id: articleId },
            {
                $push: {
                    comments: {
                        username,
                        comment,
                    },
                },
            },
        );
    };

    public static updateComment = async (articleId: string, commentId: string, newComment: string) => {
        await Article.findOneAndUpdate(
            { _id: articleId, 'comments.id': commentId }, // Find the article containing the comment
            { $set: { 'comments.$.comment': newComment } }, // Update the specific comment
        );
    };

    public static deleteComment = async (articleId: string, commentId: string) => {
        await Article.findOneAndUpdate({ _id: articleId }, { $pull: { comments: { id: commentId } } });
    };
}
