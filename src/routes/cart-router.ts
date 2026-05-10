import { Router } from "express";
import { authenticate } from "../middlewares/authentication.js";
import { getCartByUserId, removeItemFromCart, updateItemToCart } from "../controllers/CartController.js";

export const CartRouter = Router();

CartRouter.get('/', authenticate, getCartByUserId);

CartRouter.post('/update', authenticate, updateItemToCart);

CartRouter.post('/remove', authenticate, removeItemFromCart);