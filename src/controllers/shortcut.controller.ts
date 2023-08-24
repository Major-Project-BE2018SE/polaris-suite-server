import httpStatus from "http-status";
import type { Request, Response } from "express";

import { ShortcutModel } from "../models";
import { catchAsync } from "../helpers/catchAsync";
import ApiError from "../helpers/ApiError";

const shortcutsGet = catchAsync(async (req: Request, res: Response) => {
  const shortcuts = await ShortcutModel.find({ userId: req.params.userId });
  res.status(httpStatus.OK).send({ shortcuts });
});

const shortcutDelete = catchAsync(async (req: Request, res: Response) => {
  const shortcut = await ShortcutModel.findById(req.params.shortcutId);

  if(!shortcut) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shortcut not found');
  }

  shortcut.shortcuts.splice(parseInt(req.params.index), 1);
  await shortcut.save();

  res.status(httpStatus.OK).send({ message: 'Deleted successfully' });    
});

const shortcutUpdate = catchAsync(async (req: Request, res: Response) => {
  const shortcut = await ShortcutModel.findById(req.params.shortcutId);

  if(!shortcut) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shortcut not found');
  }

  Object.assign(shortcut, req.body);
  await shortcut.save();

  res.status(httpStatus.OK).send({ shortcut });
});

export {
  shortcutsGet,
  shortcutDelete,
  shortcutUpdate,
}
