import express from 'express';
import { validate } from '../middlewares/validate';
import { updateShortcut, deleteShortcut, getShortcut } from '../validations/shortcut.validation';
import { auth } from '../middlewares/auth';
import { shortcutDelete, shortcutUpdate, shortcutsGet } from '../controllers/shortcut.controller';

const router = express.Router();

router.route('/:userId')
  .get(auth(), validate(getShortcut), shortcutsGet);

router.route('/:shortcutId')
  .patch(auth(), validate(updateShortcut), shortcutUpdate);

router.route('/:shortcutId/:index')
  .delete(auth(), validate(deleteShortcut), shortcutDelete);

export default router;