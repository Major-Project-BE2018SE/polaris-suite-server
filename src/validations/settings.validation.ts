import Joi from 'joi';
import { objectId } from './custom.validation';

const updateSettings = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    theme: Joi.string().optional(),
    github: Joi.object({
      enabled: Joi.boolean().optional(),
      token: Joi.string().optional(),
      username: Joi.string().optional(),
      repos: Joi.array().items(Joi.string()).optional(),
    }).optional(),
  }).min(1),
};

const getSetting = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

export {
  updateSettings,
  getSetting,
};
