import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IManager extends Document {
    user: Types.ObjectId;
    firstName: string;
    lastName: string;
    phone: string;
    department?: string;
    hireDate?: Date;
}

const ManagerSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    department: String,
    hireDate: Date
}, { timestamps: true });

export default mongoose.model<IManager>('Manager', ManagerSchema);