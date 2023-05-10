import passport from 'passport';
import httpStatus from 'http-status';
import type { Request, Response } from 'express';

// import { roleRights } from '../config/roles';
import { UserModel } from '../models';
import ApiError from '../helpers/ApiError';

/**
 * 
 * check the requiredRights with user right in the current project
 * @param {Request} req 
 * @param resolve 
 * @param reject 
 * @param {String[]} requiredRights 
 * @returns 
 */
const verifyCallback = (req: Request, resolve, reject, requiredRights: string[]) => async (err: any, user: typeof UserModel, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    // TODO: Check the role and given authorization to that right for the current project4

    // const project  = 
    // const userRights = roleRights.get(user);
    // const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    // if (!hasRequiredRights && req.params.userId !== user.id) {
    //   return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    // }
  }

  resolve();
};

/**
 * 
 * check for the authentication of user
 * @param {String[]} requiredRights 
 * @returns 
 */
export const auth = (...requiredRights: string[]) => async (req: Request, res: Response, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};