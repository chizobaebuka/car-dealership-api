import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'customer' | 'manager' | 'admin'; // Add enum-like type constraint
}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ['customer', 'manager', 'admin'], default: 'customer' },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);