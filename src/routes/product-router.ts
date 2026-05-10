import { Router } from 'express';
import { validateRequest } from '../middlewares/request-parser.js';
import Joi from 'joi';
import { addProduct, getAllProducts, getProductById } from '../controllers/ProductController.js';
import { authenticate } from '../middlewares/authentication.js';

export const ProductRouter = Router();

ProductRouter.get('/', authenticate, getAllProducts);

ProductRouter.get('/:id', authenticate, getProductById);

// Register User Route
const createProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    imageUrl: Joi.string().uri().required(),
    rating: Joi.number().min(0).max(5).required(),
    stock: Joi.number().integer().min(0).required()
});
ProductRouter.post('/add', authenticate, validateRequest(createProductSchema), addProduct);
