import express from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

import { 
  getDashboardActivity,
  getProjectActivity,
  getTestCaseActivity,
} from '../validations/activities.validation';
import { 
  dashboardActivitiesGet,
  projectActivitiesGet,
  testcaseActivitiesGet,
} from '../controllers/activities.controller';

const router = express.Router();

router.route('/')
  .post(auth(), validate(getDashboardActivity), dashboardActivitiesGet)

router.route('/:projectId')
  .get(auth(), validate(getProjectActivity), projectActivitiesGet)

router.route('/:projectId/:testcaseId')
  .get(auth(), validate(getTestCaseActivity), testcaseActivitiesGet)

export default router;