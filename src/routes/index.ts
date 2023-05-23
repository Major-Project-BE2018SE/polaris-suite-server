import { Response } from "express";

import express from 'express';
import authRoute from './auth.route';
import projectRoute from './project.route';
import { config } from '../config/config';

const router = express.Router();

router.get('/', function (_, res: Response) {
  res.send('going good');
});

router.use('/auth', authRoute);
router.use('/projects', projectRoute);

/* istanbul ignore next */
// eslint-disable-next-line no-empty
if (config.env === 'development') {
}

export default router;