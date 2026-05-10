import { Schema, model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    contact: string;
    password: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: true }
});

export const User = model<IUser>('User', UserSchema);