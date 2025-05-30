import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrder extends Document {
    customer: Types.ObjectId;
    car: Types.ObjectId;
    manager?: Types.ObjectId;
    price: number;
    paymentMethod: 'cash' | 'credit' | 'finance';
    status: 'pending' | 'completed' | 'cancelled';
}

const OrderSchema: Schema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager'
    },
    price: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit', 'finance'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);