import httpStatus from "http-status";
import type { Request, Response } from "express";

import { ActivityModel, ProjectModel } from "../models";
import { catchAsync } from "../helpers/catchAsync";

const activitiesCreate = async (
  type: "project" | "test-case", 
  status: "project-create" | "project-delete" | "comment" | "test-pass" | "test-fail" | "mentioned" | "collaborator-add" | "collaborator-remove",
  name: string,
  description: string,
  link: string,
  projectId: string,
  testcaseId?: string,
) => {
  let activityData: {
    name: string;
    description: string;
    link: string;
    type: "project" | "test-case";
    status: "project-create" | "project-delete" | "comment" | "test-pass" | "test-fail" | "mentioned" | "collaborator-add" | "collaborator-remove";
    projectId: string;
    testcaseId?: string;
  } = {
    name,
    description,
    link,
    type,
    status,
    projectId,
  }

  if(testcaseId) {
    activityData = {
      ...activityData,
      testcaseId,
    }
  }

  await ActivityModel.create(activityData);
};

const activityDelete = async (projectId: string, testcaseId?: string) => {
  if(testcaseId) {
    await ActivityModel.deleteMany({ projectId, testcaseId });
  } else {
    await ActivityModel.deleteMany({ projectId });
  }
}

const dashboardActivitiesGet = catchAsync(async (req: Request, res: Response) => {
  const { email, userId } = req.body;

  let projects: Array<any>;

  projects = await ProjectModel.find({ members: { $elemMatch: { email } } });
  let activities: Array<any>;
  if(projects.length === 0) {
    projects = await ProjectModel.find({ ownerID: userId });

    if(projects.length === 0) {
      activities = [];
    }
  }
  const projectIds = projects.map(project => project._id);
  activities = (await ActivityModel.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 })).splice(0, 6);

  res.status(httpStatus.OK).json({ activities })
});

const projectActivitiesGet = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const activities = (await ActivityModel.find({ projectId }).sort({ createdAt: -1 })).splice(0, 6);

  res.status(httpStatus.OK).json({ activities })
});

const testcaseActivitiesGet = catchAsync(async (req: Request, res: Response) => {
  const { projectId, testcaseId } = req.params;
  const activities = (await ActivityModel.find({ projectId, testcaseId }).sort({ createdAt: -1 })).splice(0, 6);

  res.status(httpStatus.OK).json({ activities })
});

export {
  activitiesCreate,
  activityDelete,
  dashboardActivitiesGet,
  projectActivitiesGet,
  testcaseActivitiesGet,
}
