import httpStatus from "http-status";
import type { Request, Response } from "express";

import { EnvironmentModel, ProjectModel } from "../models";
import { catchAsync } from "../helpers/catchAsync";
import ApiError from "../helpers/ApiError";

const environmentCreate = catchAsync(async (req: Request, res: Response) => {   
  const environment = await EnvironmentModel.create(req.body);
  
  const project = await ProjectModel.findById(req.params.projectId);
  
  if(!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  
  project.environments.push(environment._id);
  await project.save();
  
  res.status(httpStatus.CREATED).json({ environment });
});

const environmentGet = catchAsync(async (req: Request, res: Response) => {
  const environment = await EnvironmentModel.findById(req.params.environmentId);
  
  if(!environment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Environment not found');
  }
  
  res.status(httpStatus.OK).send({ environment });
});

const environmentsGet = catchAsync(async (req: Request, res: Response) => {
  const project = await ProjectModel.findById(req.params.projectId);
  const environments = project?.environments.map(async (env) => {
    return await EnvironmentModel.findById(env)
  }) || [];
  res.status(httpStatus.OK).send({ environments });
});

const environmentDelete = catchAsync(async (req: Request, res: Response) => {
  const environment = await EnvironmentModel.findById(req.params.environmentId);
  
  if(!environment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Environment not found');
  }
  
  const project = await ProjectModel.findById(req.params.projectId);
  
  if(!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  
  project.environments = project.environments.filter((env) => env !== environment._id);
  await project.save();
  
  await environment.deleteOne();
  
  res.status(httpStatus.OK).send({ message: 'Deleted successfully' });    
});

const environmentUpdate = catchAsync(async (req: Request, res: Response) => {
  const environment = await EnvironmentModel.findById(req.params.environmentId);
  
  if(!environment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Environment not found');
  }
  
  Object.assign(environment, req.body);
  await environment.save();
  
  res.status(httpStatus.OK).send({ environment });
});

export {
  environmentCreate,
  environmentGet,
  environmentsGet,
  environmentDelete,
  environmentUpdate,
}
