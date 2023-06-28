import httpStatus from "http-status";
import type { Request, Response } from "express";

import { ProjectModel } from "../models";
import { catchAsync } from "../helpers/catchAsync";
import ApiError from "../helpers/ApiError";

const projectCreate = catchAsync(async (req: Request, res: Response) => {   
    const project = await ProjectModel.create(req.body);

    res.status(httpStatus.CREATED).json({ project });
});

const projectGet = catchAsync(async (req: Request, res: Response) => {
    const project = await ProjectModel.findById(req.params.projectId).populate('environments');

    if(!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    
    res.status(httpStatus.OK).send({ project });
});

const projectsGet = catchAsync(async (_: Request, res: Response) => {
    const projects = await ProjectModel.find({});
    res.status(httpStatus.OK).send({ projects });
});

const projectDelete = catchAsync(async (req: Request, res: Response) => {
    const project = await ProjectModel.findById(req.params.projectId);

    if(!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }

    await project.deleteOne();

    res.status(httpStatus.OK).send({ message: 'Deleted successfully' });    
});

const projectUpdate = catchAsync(async (req: Request, res: Response) => {
    const project = await ProjectModel.findById(req.params.projectId);

    if(!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }

    Object.assign(project, req.body);
    await project.save();

    res.status(httpStatus.OK).send({ project });
});

const projectInvite = catchAsync(async (req: Request, res: Response) => {
    const project = await ProjectModel.findById(req.params.projectId);

    if(!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }

    if(project.members.find(member => member.email === req.body.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User already invited');
    }

    project.members.push(req.body);
    await project.save();

    res.status(httpStatus.OK).send({ project });
});

const projectMemberRemove = catchAsync(async (req: Request, res: Response) => {
    const project = await ProjectModel.findById(req.params.projectId);

    if(!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }

    project.members = project.members.filter(member => member.email !== req.body.email);
    await project.save();

    res.status(httpStatus.OK).send({ project });
});

export {
    projectCreate,
    projectGet,
    projectsGet,
    projectDelete,
    projectUpdate,
    projectInvite,
    projectMemberRemove,
}
