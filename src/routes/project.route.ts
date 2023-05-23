import express from 'express';
import { validate } from '../middlewares/validate';
import { createProject, deleteProject, getProject, getProjects, updateProject } from '../validations/project.validation';
import { auth } from '../middlewares/auth';
import { projectCreate, projectDelete, projectGet, projectUpdate, projectsGet } from '../controllers/project.controller';

const router = express.Router();

router.route('/')
    .post(auth(), validate(createProject), projectCreate)
    .get(auth(), validate(getProjects), projectsGet);

router.route('/:projectId')
    .get(auth(), validate(getProject), projectGet)
    .delete(auth(), validate(deleteProject), projectDelete)
    .patch(auth(), validate(updateProject), projectUpdate);

export default router;