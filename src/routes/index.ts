import { Response } from "express";

import express from 'express';
import { config } from '../config/config';

import authRoute from './auth.route';
import projectRoute from './project.route';
import environmentRoute from './environment.route';
import testcaseRoute from './testcase.route';
import commentRoute from './comment.route';
import activitiesRoute from './activities.route';
import settingsRoute from './settings.route';
import shortcutRoute from './shortcut.route';
import dashboardRoute from './dashboard.route';

import githubRoute from './github.routes';

const router = express.Router();

router.get('/', function (_, res: Response) {
  res.send('going good');
});

router.use('/auth', authRoute);
router.use('/projects', projectRoute);
router.use('/environments', environmentRoute);
router.use('/testcases', testcaseRoute);
router.use('/comments', commentRoute);
router.use('/activities', activitiesRoute);
router.use('/settings', settingsRoute);
router.use('/shortcuts', shortcutRoute);
router.use('/dashboard', dashboardRoute);

router.use('/github', githubRoute);

/* istanbul ignore next */
// eslint-disable-next-line no-empty
if (config.env === 'development') {
}

export default router;