import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    description?: string;
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: String
}, { timestamps: true });

export default mongoose.model<ICategory>('Category', CategorySchema);