import Joi from 'joi';
import { objectId } from './custom.validation';

const createComment = {
  params: Joi.object().keys({
    testcaseId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    comment: Joi.string().required(),
    userId: Joi.string().required().custom(objectId),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    testcaseId: Joi.string().required().custom(objectId),
    commentId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    comment: Joi.string().optional(),
    userId: Joi.string().optional().custom(objectId),
    likes: Joi.array().items(Joi.string().custom(objectId)).min(1),
    replies: Joi.array().items(Joi.string().custom(objectId)).min(1),
  }).min(1),
};

const deleteComment = {
  params: Joi.object().keys({
    testcaseId: Joi.string().required().custom(objectId),
    commentId: Joi.string().required().custom(objectId),
  }),
};

export {
  createComment,
  updateComment,
  deleteComment,
};
