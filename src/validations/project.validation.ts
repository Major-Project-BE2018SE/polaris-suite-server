import Joi from 'joi';
import { objectId } from './custom.validation';

const createProject = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().optional(),
        ownerID: Joi.string().required().custom(objectId),
        members: Joi.array().items(Joi.object({
            id: Joi.string().required().custom(objectId),
            role: Joi.string().valid("tester", "developer", "stakeholder").required(),
        })).optional(),
        environments: Joi.array().items(Joi.custom(objectId)).optional(),
        status: Joi.string().valid("in progress", "hold", "draft", "archived", "done").optional(),
    }),
};

const updateProject = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        members: Joi.array().items(Joi.object({
            _id: Joi.string().optional().custom(objectId),
            role: Joi.string().valid("tester", "developer", "stakeholder").required(),
            email: Joi.string().optional(),
            status: Joi.string().valid("pending", "accepted", "declined").optional(),
        })).optional(),
        environments: Joi.array().items(Joi.custom(objectId)).optional(),
        status: Joi.string().valid("in progress", "hold", "draft", "archived", "done").optional(),
    }).min(1),
};

const deleteProject = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
    }),
};

const getProject = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
    }),
};

const getProjects = {
    query: Joi.object().keys({
        name: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const removeMember = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys({
        email: Joi.string().required(),
    }),
};

const projectMember = {
    params: Joi.object().keys({
        projectId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys({
        email: Joi.string().required(),
        role: Joi.string().valid("tester", "developer", "stakeholder").required(),
    }),
}

export {
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getProjects,
    removeMember,
    projectMember,
};
