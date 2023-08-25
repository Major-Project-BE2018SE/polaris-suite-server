import Joi from 'joi';
import express from 'express';
import type { Request, Response } from 'express';

import { validate } from '../middlewares/validate';
import { catchAsync } from '../helpers/catchAsync';
import { objectId } from '../validations/custom.validation';
import { ProjectModel, ShortcutModel, TestCaseModel, UserModel } from '../models';
import httpStatus from 'http-status';

const router = express.Router();

router.get('/:userId', 
  validate({ 
    params: Joi.object().keys({
      userId: Joi.string().required().custom(objectId),
    })
  }), 
  catchAsync(async (req: Request, res: Response) => {

    const user = await UserModel.findById(req.params.userId);
    const projects = await ProjectModel.find({ $or: [{ ownerID: user._id }, { members: { $elemMatch: { email: user.email } }}] });
    let totalTestCases = 0;

    for (let index = 0; index < projects.length; index++) {
      const testcases = await TestCaseModel.find({ linkedProject: projects[index]._id });
      totalTestCases += testcases.length;      
    }

    const shortcuts = await ShortcutModel.findOne({ userId: req.params.userId });

    const dashboard = {
      projects: projects,
      totalReports: 0,
      totalTestCases: totalTestCases,
      shortcuts,
    }

    res.status(httpStatus.OK).json({ dashboard });
  }));

export default router;