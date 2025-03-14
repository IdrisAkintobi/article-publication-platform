import { model, Schema, type InferSchemaType } from 'mongoose';

interface IUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    DOB: Date;
    password: string;
    email: string;
    phoneNumber?: string;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
        firstName: { type: String, required: true, trim: true, minlength: 3 },
        lastName: { type: String, required: true, trim: true, minlength: 3 },
        DOB: { type: Date, required: true },
        password: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 5,
        },
        phoneNumber: { type: String, trim: true, required: false, minlength: 8 },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    },
);

export type UserType = InferSchemaType<typeof userSchema>;
export const User = model('User', userSchema);
