import express from 'express';
import { validate } from '../middlewares/validate';
import { createProject, deleteProject, getProject, getProjects, removeMember, updateProject } from '../validations/project.validation';
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

router.route('/:projectId/invite')
    .post(auth(), validate(updateProject), projectUpdate);

router.route('/:projectId/invite/accept')
    .post(auth(), validate(updateProject), projectUpdate);

router.route('/:projectId/members/remove/:memberId')
    .patch(auth(), validate(removeMember), projectUpdate);


export default router;