import fs from 'fs';
import express, { Request, Response } from 'express';
import { auth } from '../middlewares/auth';
import { catchAsync } from '../helpers/catchAsync';
import { SettingModel } from '../models';
import { getToken } from 'github-app-installation-token';
import { config } from '../config/config';
import { Octokit } from 'octokit';

const router = express.Router();

router.route('/:userId/repos')
  .get(auth(), catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    
    const setting = await SettingModel.findOne({ userId: userId });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    const { token } = await getToken({
      appId: config.github.appId,
      installationId: parseInt(setting.github.installationId),
      privateKey: fs.readFileSync('.GITHUB_PEM', 'utf8'),
    });

    const octokit = new Octokit({
      auth: token,
    });

    try {
      const { data: repos } = await octokit.rest.apps.listReposAccessibleToInstallation();
  
      res.status(200).json({ repos: repos.repositories });
    } catch (error) {
      throw new Error(error);
    }
  }));

export default router;