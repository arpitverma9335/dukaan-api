import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../schemas/user-schema.js';
import { PoccError } from '../middlewares/error-handler.js';
import { Cart } from '../schemas/cart-schema.js';
import { Address } from '../schemas/address-schema.js';

dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, contact, password } = req.body;
    const hashPassword = await hash(password, 4); 
    const newUser = await User.create({ username, email, contact, password: hashPassword });
    await Cart.create({ userId: newUser._id, items: [], totalPrice: 0 });
    res.json({
        success: true,
        message: 'User registered successfully.',
        user: newUser
    });
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        throw new PoccError(404, 'User not found');
    }

    const hashPassword = await compare(password, user.password);

    if (!hashPassword) {
        throw new PoccError(401, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '');
    const cart = await Cart.findOne({userId: user._id }).select('totalItems').exec();

    res.json({
        success: true,
        message: 'User logged in successfully.',
        token: token,
        user: {
            username: user.username,
            email: user.email,
            contact: user.contact,
            cartQuantity: cart?.totalItems ?? 0
        }
    });
};

export const getUserAddressProfile = async (req: Request, res: Response) => {
    // @ts-ignore
    const { userId } = req.user;

    const address = await Address.findOne({ userId }).exec();
    res.json({
        success: true,
        message: 'User address retrieved successfully.',
        address
    });
};

export const handleAddressUpdate = async (req: Request, res: Response) => {
    // @ts-ignore
    const { userId } = req.user;
    
    const { name, street, city, state, country, zip } = req.body;

    let address = await Address.findOneAndUpdate(
        { userId },
        { name, street, city, state, country, zip },
        { new: true }
    );

    if (!address) {
        address = await Address.create({ userId, name, street, city, state, country, zip });
    }

    res.json({
        success: true,
        message: 'Address updated successfully.',
        address
    });
};