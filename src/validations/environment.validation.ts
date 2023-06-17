import Joi from 'joi';
import { objectId } from './custom.validation';

const createEnvironment = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().optional(),
        variables: Joi.array().items(Joi.object({
            key: Joi.string().required(),
            value: Joi.string().required(),
        })).optional(),
    }),
};

const updateEnvironment = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
        environmentId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        variables: Joi.array().items(Joi.object({
            key: Joi.string().required(),
            value: Joi.string().required(),
        })).optional(),
    }).min(1),
};

const deleteEnvironment = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
        environmentId: Joi.string().required().custom(objectId),
    }),
};

const getEnvironment = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
        environmentId: Joi.string().required().custom(objectId),
    }),
};

const getEnvironments = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
        environmentId: Joi.string().required().custom(objectId),
    }),
    query: Joi.object().keys({
        name: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

export {
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    getEnvironment,
    getEnvironments,
};
