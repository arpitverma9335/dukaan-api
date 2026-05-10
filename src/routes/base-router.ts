import { Router } from 'express';
import { UserRouter } from './userRouter.js';
import { ProductRouter } from './product-router.js';
import { CartRouter } from './cart-router.js';
import { OrderRouter } from './order-router.js';

export const ApiRouter = Router();

ApiRouter.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Bazaar API',
    })
});

ApiRouter.use('/users', UserRouter);
ApiRouter.use('/products', ProductRouter);
ApiRouter.use('/cart', CartRouter);
ApiRouter.use('/orders', OrderRouter);