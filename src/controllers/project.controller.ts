import httpStatus from "http-status";
import type { Request, Response } from "express";

import { ProjectModel } from "../models";
import { catchAsync } from "../helpers/catchAsync";
import ApiError from "../helpers/ApiError";
import { sendEmail } from "../helpers/mailer";
import { config } from "../config/config";
import { activitiesCreate } from "./activities.controller";
import { inviteEmailTemplate } from "../utils/emailTemplate";

const projectCreate = catchAsync(async (req: Request, res: Response) => {
  const project = await ProjectModel.create(req.body);

  await activitiesCreate(
    "project", 
    "project-create", 
    `Create a new project ${project.name}`, 
    `A new project ${project.name} has been created`, 
    `/polaris/projects/${project._id}`, 
    project._id,
  );

  res.status(httpStatus.CREATED).json({ project });
});

const projectGet = catchAsync(async (req: Request, res: Response) => {
  const project = await ProjectModel.findById(req.params.projectId).populate('environments');

  if(!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  res.status(httpStatus.OK).send({ project });
});

const projectsGet = catchAsync(async (req: Request, res: Response) => {
  const projects = req.query.status === "all" ? await ProjectModel.find({}) : await ProjectModel.find({ status: { $ne: 'archieved' } });
  res.status(httpStatus.OK).send({ projects });
});

const projectDelete = catchAsync(async (req: Request, res: Response) => {
  const project = await ProjectModel.findById(req.params.projectId);

  if(!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  await activitiesCreate(
    "project", 
    "project-delete", 
    `Removed a project ${project.name}`, 
    `Project ${project.name} has been deleted`, 
    `/polaris/projects`, 
    project._id,
  );

  await project.deleteOne();

  res.status(httpStatus.OK).send({ message: 'Deleted successfully' });    
});

const projectUpdate = catchAsync(async (req: Request, res: Response) => {
  const project = await ProjectModel.findById(req.params.projectId);

  if(!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  Object.assign(project, req.body);
  await project.save().then((project) => project.populate('environments'));

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

  const acceptUrl = `${config.frontendUrl}/accept-invitation?projectId=${project._id}&email=${req.body.email}`;
  const declineUrl = `${config.frontendUrl}/decline-invitation?projectId=${project._id}&email=${req.body.email}`;

  const body = inviteEmailTemplate(acceptUrl, declineUrl, project.name);

  await sendEmail(req.body.email, 'Invitation to project', body);

  project.members.push(req.body);
  await project.save();

  await activitiesCreate(
    "project", 
    "collaborator-add", 
    `Collaborator Added`, 
    `A new collaborator has been added to the project ${project.name}`, 
    `/polaris/projects/${project._id}/settings`, 
    project._id,
  );

  res.status(httpStatus.OK).send({ project });
});

const projectInviteAccept = catchAsync(async (req: Request, res: Response) => {
  const project = await ProjectModel.findById(req.params.projectId);

  if(!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  if(project.members.find(member => (member.email === req.body.email && member.status === "accepted"))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User has already accepted the invitation');
  }

  if(req.query.accept === "false" && project.members.find(member => (member.email === req.body.email && member.status === "declined"))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User has already declined the invitation');
  }

  let newMembersStatus = project.members;

  if(req.query.accept && req.query.accept === "false") {
    newMembersStatus = project.members.map(member => {
      if(member.email === req.body.email) {
        member.status = "declined";
      }
      return member;
    });
  }else {
    newMembersStatus = project.members.map(member => {
      if(member.email === req.body.email) {
        member.status = "accepted";
      }
      return member;
    });
  }
  
  project.members = newMembersStatus;
  await project.save();

  res.status(httpStatus.OK).send({ project });
});

const projectMemberRemove = catchAsync(async (req: Request, res: Response) => {
  const project = await ProjectModel.findById(req.params.projectId);

  if(!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  if(!project.members.find(member => member.email === req.body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User found in the project');
  }

  project.members = project.members.filter(member => member.email !== req.body.email);
  await project.save();

  await activitiesCreate(
    "project", 
    "collaborator-remove", 
    `Collaborator Removed`, 
    `Collaborator ${req.body.email} has been removed from the project ${project.name}`, 
    `/polaris/projects/${project._id}/settings`, 
    project._id,
  );

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
  projectInviteAccept,
}
