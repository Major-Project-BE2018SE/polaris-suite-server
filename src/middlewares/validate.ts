import Joi from 'joi';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { pick } from '../helpers/pick';

export const validate = (schema: object) => (req: Request, res: Response, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(res.status(httpStatus.BAD_REQUEST).json({ message: errorMessage }));
  }
  Object.assign(req, value);
  return next();
};
