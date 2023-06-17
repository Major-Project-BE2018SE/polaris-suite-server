import { Response } from "express";

import express from 'express';
import { config } from '../config/config';

import authRoute from './auth.route';
import projectRoute from './project.route';
import environmentRoute from './environment.route';

const router = express.Router();

router.get('/', function (_, res: Response) {
  res.send('going good');
});

router.use('/auth', authRoute);
router.use('/projects', projectRoute);
router.use('/environments', environmentRoute);

/* istanbul ignore next */
// eslint-disable-next-line no-empty
if (config.env === 'development') {
}

export default router;