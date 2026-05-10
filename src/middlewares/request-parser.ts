import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { PoccError } from './error-handler.js';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new PoccError(400, error.details[0].message);
    }
    next();
  }
};