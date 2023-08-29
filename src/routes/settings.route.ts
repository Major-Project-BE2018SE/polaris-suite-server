import express from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

import { 
  getSetting,
  updateSettings,
} from '../validations/settings.validation';
import { 
  settingGet,
  settingUpdate
} from '../controllers/settings.controller';

const router = express.Router();

router.route('/:userId')
  .patch(auth(), validate(updateSettings), settingUpdate)
  .get(auth(), validate(getSetting), settingGet);

export default router;