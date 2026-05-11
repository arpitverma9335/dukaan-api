import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PoccError } from './error-handler.js';

dotenv.config();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new PoccError(401, 'Unauthorised access.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new PoccError(401, 'Unauthorised access.');
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || '');

    // @ts-ignore
    req.user = verified;

    next();
}