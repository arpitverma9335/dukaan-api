import { Request, Response } from "express";
import { Cart } from "../schemas/cart-schema.js";
import { PoccError } from "../middlewares/error-handler.js";
import { Schema } from "mongoose";
import { Product } from "../schemas/product-schema.js";

export const getCartByUserId = async (req: Request, res: Response) => {
    // @ts-ignore
    const { userId } = req.user;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId').lean().exec();

        if (!cart) {
            throw new PoccError(400, 'Cart not found for this user');
        }

        res.json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw new PoccError(500, error instanceof Error ? error.message : 'Internal Server Error');
    }
};

export const updateItemToCart = async (req: Request, res: Response) => {
    // @ts-ignore
    const { userId } = req.user;

    const { productId, quantity } = req.body;
    try {
        const [cart, product] = await Promise.all([
            Cart.findOne({ userId }).exec(),
            Product.findById(productId).exec()
        ]);

        if(!product) {
            throw new PoccError(404, 'Product not found');
        };

        if (!cart) {
            throw new PoccError(400, 'Cart not found for this user');
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += Number(quantity);

            if (cart.items[existingItemIndex].quantity <= 0) {
                throw new PoccError(400, 'Quantity must be greater than zero');
            }

            cart.totalItems += Number(quantity);
            cart.items[existingItemIndex].price = product.price* cart.items[existingItemIndex].quantity;
            cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
        } else {
            cart.items.push({ productId: (productId as unknown) as Schema.Types.ObjectId, quantity: Number(quantity), price: product.price* Number(quantity) });

            if(quantity <= 0) {
                throw new PoccError(400, 'Quantity must be greater than zero');
            }

            cart.totalItems += Number(quantity);
            cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
        }
        

        await cart.save();

        const updated = await Cart.findOne({ userId }).populate('items.productId').lean().exec();

        res.json({
            success: true,
            message: 'Item updated in cart successfully.',
            cart: updated
        });
    } catch (error) {
        console.error('Error updating item in cart:', error);
        throw error;
    }
}

export const removeItemFromCart = async (req: Request, res: Response) => {
    // @ts-ignore
    const { userId } = req.user;
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId }).exec();
        if (!cart) {
            throw new PoccError(400, 'Cart not found for this user');
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            throw new PoccError(404, 'Item not found in cart');
        }
        cart.totalItems -= cart.items[itemIndex].quantity;
        cart.totalPrice -= cart.items[itemIndex].price;

        cart.items.splice(itemIndex, 1);
        
        await cart.save();

        const updated = await Cart.findOne({ userId }).populate('items.productId').lean().exec();

        res.json({
            success: true,
            message: 'Item removed from cart successfully.',
            cart: updated
        });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw new PoccError(500, error instanceof Error ? error.message : 'Internal Server Error');
    }
};