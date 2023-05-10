import type { Request, Response } from "express";

/**
 * 
 * Catch any async errors
 * @param {Function} fn function to execute
 * @returns 
 */
export const catchAsync = (fn: Function) => (req: Request, res: Response, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};