import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export class PoccError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message); // Pass message to the base Error class
    this.statusCode = statusCode;
    this.name = 'PoccError'; // Set the error name to your class name

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PoccError);
    }
  }
}

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    
    // 1. Handle your Custom App Errors (like "Cart is empty")
    if (err instanceof PoccError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message, // Flattened: Directly at the top
            code: err.name,
            status: err.statusCode
        });
    }

    // 2. Handle Mongoose Validation Errors (Optional but recommended)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map((val: any) => val.message).join(', '),
            code: 'VALIDATION_ERROR'
        });
    }

    // 3. Fallback for everything else (500)
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected server error occurred',
        code: err.name || 'INTERNAL_ERROR'
    });
};