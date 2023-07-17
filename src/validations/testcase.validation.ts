import Joi from 'joi';
import { objectId } from './custom.validation';

const createBody = {
  name: Joi.string().required(),
  description: Joi.string().optional(),
  creatorId: Joi.string().required().custom(objectId),
  linkedProject: Joi.string().required().custom(objectId),
  environment: Joi.string().required().custom(objectId),
  status: Joi.string().valid("in progress", "in review", "done").optional(),
  type: Joi.string().valid("unit", "integration", "component", "api", "e2e").optional(),
}

const createTestCase = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
    environmentId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys(createBody),
};

const createTestCaseAll = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    ...createBody,
    environment: Joi.string().required(),
  }),
};

const updateTestCase = {
  params: Joi.object().keys({
    testcaseId: Joi.string().required().custom(objectId),
    projectId: Joi.string().required().custom(objectId),
    environmentId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    creatorId: Joi.string().optional().custom(objectId),
    linkedProject: Joi.string().optional().custom(objectId),
    environment: Joi.string().optional().custom(objectId),
    status: Joi.string().valid("in progress", "in review", "done").optional(),
    type: Joi.string().valid("unit", "integration", "component", "api", "e2e").optional(),
    recentRun: Joi.string().valid("pass", "fail").optional(),
    testRuns: Joi.array().items(Joi.object().keys({
      result: Joi.string().required(),
      status: Joi.string().valid("pass", "fail").required(),
      logs: Joi.array().items(Joi.string()).required(),
      initiatedBy: Joi.string().required().custom(objectId),
      createdAt: Joi.date().required(),
    })).optional(),
    testSchema: Joi.array().items(Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().optional(),
      params: Joi.array().items(Joi.object().keys({
        name: Joi.string().required(),
        value: Joi.string().optional(),
      })).optional(),
      returns: Joi.any().optional(),
    })).optional(),
  }).min(1),
};

const deleteTestCase = {
  params: Joi.object().keys({
    testcaseId: Joi.string().required().custom(objectId),
    projectId: Joi.string().required().custom(objectId),
    environmentId: Joi.string().required().custom(objectId),
  }),
};

const getTestCase = {
  params: Joi.object().keys({
    testcaseId: Joi.string().required().custom(objectId),
    projectId: Joi.string().required().custom(objectId),
    environmentId: Joi.string().required().custom(objectId),
  }),
};

const getTestCases = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
    environmentId: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    status: Joi.string(),
  }),
};

const getTestCasesAll = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    status: Joi.string(),
  }),
};

export {
  createTestCase,
  createTestCaseAll,
  updateTestCase,
  deleteTestCase,
  getTestCase,
  getTestCases,
  getTestCasesAll,
};
