import Joi from 'joi';
import { password } from './custom.validation';

const registerValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const loginValidate = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logoutValidate = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokensValidate = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPasswordValidate = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPasswordValidate = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmailValidate = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export {
  registerValidate,
  loginValidate,
  logoutValidate,
  refreshTokensValidate,
  forgotPasswordValidate,
  resetPasswordValidate,
  verifyEmailValidate,
};