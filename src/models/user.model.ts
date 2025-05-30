import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'customer' | 'manager' | 'admin';
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['customer', 'manager', 'admin'],
        default: 'customer'
    }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);