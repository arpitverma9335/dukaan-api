import { Router } from 'express';
import { validateRequest } from '../middlewares/request-parser.js';
import Joi from 'joi';
import { getUserAddressProfile, handleAddressUpdate, loginUser, registerUser } from '../controllers/UserController.js';
import { authenticate } from '../middlewares/authentication.js';

export const UserRouter = Router();

// Register User Route
const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  contact: Joi.string().pattern(/^\d{10}$/).required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
});
UserRouter.post('/register', validateRequest(registerSchema), registerUser);

// Login User Route
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});
UserRouter.post('/login', validateRequest(loginSchema), loginUser);

UserRouter.get('/address', authenticate, getUserAddressProfile);

const updateAddressSchema = Joi.object({
  name: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(), 
  state: Joi.string().required(),
  country: Joi.string().required(),
  zip: Joi.string().required()
})
UserRouter.post('/address', authenticate, validateRequest(updateAddressSchema), handleAddressUpdate);