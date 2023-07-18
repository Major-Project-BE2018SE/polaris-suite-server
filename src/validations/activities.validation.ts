import Joi from 'joi';
import { objectId } from './custom.validation';

const getDashboardActivity = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    userId: Joi.string().required().custom(objectId),
  }),
};

const getProjectActivity = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
  }),
};

const getTestCaseActivity = {
  params: Joi.object().keys({
    testcaseId: Joi.string().required().custom(objectId),
    projectId: Joi.string().required().custom(objectId),
  }),
};

export {
  getDashboardActivity,
  getProjectActivity,
  getTestCaseActivity,
};
