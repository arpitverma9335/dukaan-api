import { Schema, model } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  stock: number;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, 
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    rating: { type: Number, required: true },
    stock: { type: Number, required: true }
});

export const Product = model<IProduct>('Product', ProductSchema);