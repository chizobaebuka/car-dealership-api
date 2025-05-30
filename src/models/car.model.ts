import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICar extends Document {
    brand: string;
    carModel: string;
    year: number;
    price: number;
    color?: string;
    mileage?: number;
    category: Types.ObjectId;
    features?: string[];
    availability: boolean;
}

const CarSchema: Schema = new Schema({
    brand: { type: String, required: true },
    carModel: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    color: String,
    mileage: Number,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    features: [String],
    availability: { type: Boolean, default: true }
}, { timestamps: true });


export default mongoose.model<ICar>('Car', CarSchema);