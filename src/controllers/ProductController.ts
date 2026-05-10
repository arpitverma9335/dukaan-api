import { Request, Response } from 'express';
import { Product } from '../schemas/product-schema.js';
import { Cart } from '../schemas/cart-schema.js';

export const addProduct = async (req: Request, res: Response) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: newProduct
    });
};

export const getAllProducts = async (req: Request, res: Response) => {
    // @ts-ignore
    const { userId } = req.user; // Type assertion to access userId

    const [products, cart] = await Promise.all([
        Product.find(),
        Cart.findOne({ userId }).populate('items.productId', '_id quantity').lean().exec()
    ]);

    products.forEach(product => {
        if (cart) {
            const cartItem = cart.items.find((item: any) => item.productId._id.toString() === product._id.toString());
            if (cartItem) {
                product.set('existsInCart', true, { strict: false });
            } else {
                product.set('existsInCart', false, { strict: false });
            }
        } else {
            product.set('existsInCart', false, { strict: false });
        }
    });

    res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: products
    });
};

export const getProductById = async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product
    });
};