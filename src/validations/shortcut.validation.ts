import Joi from 'joi';
import { objectId } from './custom.validation';

const updateShortcut = {
  params: Joi.object().keys({
    shortcutId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
    shortcuts: Joi.array().items(Joi.object().keys({
      title: Joi.string().optional(),
      project: Joi.string().optional(),
    })).optional(),
  }).required(),
};

const getShortcut = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const deleteShortcut = {
  params: Joi.object().keys({
    shortcutId: Joi.string().required().custom(objectId),
    index: Joi.number().required(),
  }),
};

export {
  updateShortcut,
  getShortcut,
  deleteShortcut,
};
