import Joi from 'joi';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { pick } from '../helpers/pick';
import ApiError from '../helpers/ApiError';

export const validate = (schema: object) => (req: Request, _: Response, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};
