import { Router } from "express";
import { authenticate } from "../middlewares/authentication.js";
import { createOrder, fetchOrderById, fetchOrders } from "../controllers/OrderController.js";

export const OrderRouter = Router();

OrderRouter.get('/', authenticate, fetchOrders);
OrderRouter.get('/:id', authenticate, fetchOrderById);
OrderRouter.post('/place', authenticate, createOrder);