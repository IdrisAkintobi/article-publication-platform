import { model, Schema, type InferSchemaType } from 'mongoose';

// Comment Schema
const commentSchema = new Schema(
    {
        username: { type: String, required: true },
        comment: { type: String, required: true, minlength: 2 },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            },
        },
    },
);

// Article Schema
const articleSchema = new Schema(
    {
        title: { type: String, required: true, trim: true, minlength: 10 },
        content: { type: String, required: true, minlength: 20 },
        author: { type: String, required: true, index: true },
        publicationDate: { type: Date, default: new Date() },
        likes: { type: Number, default: 0, min: 0 },
        dislikes: { type: Number, default: 0, min: 0 },
        comments: [commentSchema],
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            },
        },
    },
);

export type ArticleType = InferSchemaType<typeof articleSchema>;
export const Article = model('Article', articleSchema);
