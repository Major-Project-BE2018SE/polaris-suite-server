import httpStatus from "http-status";
import type { Request, Response } from "express";

import { SettingModel } from "../models";
import { catchAsync } from "../helpers/catchAsync";
import ApiError from "../helpers/ApiError";

const settingGet = catchAsync(async (req: Request, res: Response) => {
  const setting = await SettingModel.findOne({ userId: req.params.userId });
  
  if(!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Setting not found');
  }
  
  res.status(httpStatus.OK).send({ setting });
});

const settingUpdate = catchAsync(async (req: Request, res: Response) => {
  const setting = await SettingModel.findOne({ userId: req.params.userId });
  
  if(!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Setting not found');
  }
  
  Object.assign(setting, req.body);
  await setting.save();
  
  res.status(httpStatus.OK).send({ setting });
});

export {
  settingGet,
  settingUpdate,
}
