import { Request, Response } from "express";
import { Order } from "../schemas/order-schema.js";
import { Cart } from "../schemas/cart-schema.js";
import { PoccError } from "../middlewares/error-handler.js";
import { Address } from "../schemas/address-schema.js";

export const fetchOrders = async (req: Request, res: Response) => {
    // @ts-ignore
    const { userId } = req.user;

    const orders = await Order.find({ userId }, { 
            items: { $slice: 1 }
        }).populate({
        path: 'items.productId',
        select: 'name imageUrl'
    }).exec();
    res.json({ 
        success: true,
        message: 'Orders fetched successfully',
        orders
    });
}

export const fetchOrderById = async (req: Request, res: Response) => {
    // @ts-ignore
    const { userId } = req.user;
    
    const { id } = req.params;  
    const order = await Order.findOne({ _id: id, userId }).populate({
        path: 'items.productId',
        select: 'name imageUrl price description',
    }).populate('shipping', 'name street city state country zip').exec();
    if (!order) {
        throw new PoccError(404, 'Order not found');
    }
    res.json({ 
        success: true,
        message: 'Order fetched successfully',
        order
    });
}

export const createOrder = async (req: Request, res: Response) => {
    // @ts-ignore
    const { userId } = req.user;
    const [cart, address] = await Promise.all([
        Cart.findOne({ userId }).populate('items.productId', '_id').lean().exec(),
        Address.findOne({ userId }).exec()
    ]);    

    if (!cart) {
        throw new PoccError(400, 'Cart not found');
    }

    if (!address) {
        throw new PoccError(400, 'Address not found');
    }

    if(cart.items.length === 0) {
        throw new PoccError(400, 'Cart is empty');
    }

    const newOrder = new Order({
        userId,
        shipping: address._id,
        items: cart.items,
        totalPrice: cart.totalPrice,
        status: 'Pending'
    });

    await newOrder.save();
    await Cart.findByIdAndUpdate(cart._id, { $set: { items: [], totalPrice: 0, totalItems: 0 } }).exec();

    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        // order: newOrder
    });

};
