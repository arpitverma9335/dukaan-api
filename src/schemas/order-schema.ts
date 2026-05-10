import { Schema, model } from 'mongoose';

interface IOrder {
    userId: Schema.Types.ObjectId;
    date: Date;
    shipping: Schema.Types.ObjectId;
    items: {
        productId: Schema.Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    status: 'Pending' | 'Completed' | 'Cancelled';
}

const OrderSchema = new Schema<IOrder>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: { type: Date, default: Date.now },
    shipping: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' }
});

export const Order = model<IOrder>('Order', OrderSchema);