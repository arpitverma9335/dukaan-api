import { Schema, model } from 'mongoose';

interface ICart {
    userId: Schema.Types.ObjectId;
    totalItems: number;
    items: {
        productId: Schema.Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
}

const CartSchema = new Schema<ICart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalItems: { type: Number, required: true, default: 0 },
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
    totalPrice: { type: Number, required: true }
});

export const Cart = model<ICart>('Cart', CartSchema);