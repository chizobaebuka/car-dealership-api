import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICustomer extends Document {
    user: Types.ObjectId;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    favoriteBrands?: string[];
}

const CustomerSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    favoriteBrands: [String]
}, { timestamps: true });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);