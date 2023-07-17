import express from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

import { 
  createEnvironment,
  getEnvironments,
  getEnvironment,
  deleteEnvironment,
  updateEnvironment, 
} from '../validations/environment.validation';
import { 
  environmentCreate, 
  environmentGet,
  environmentsGet,
  environmentDelete,
  environmentUpdate,
} from '../controllers/environment.controller';

const router = express.Router();

router.route('/:projectId')
  .post(auth(), validate(createEnvironment), environmentCreate)
  .get(auth(), validate(getEnvironments), environmentsGet);

router.route('/:projectId/:environmentId')
  .get(auth(), validate(getEnvironment), environmentGet)
  .delete(auth(), validate(deleteEnvironment), environmentDelete)
  .patch(auth(), validate(updateEnvironment), environmentUpdate);

export default router;