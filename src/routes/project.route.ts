import express from 'express';
import { validate } from '../middlewares/validate';
import { createProject, deleteProject, getProject, getProjects, projectMember, removeMember, updateProject } from '../validations/project.validation';
import { auth } from '../middlewares/auth';
import { projectCreate, projectDelete, projectGet, projectInvite, projectInviteAccept, projectMemberRemove, projectUpdate, projectsGet } from '../controllers/project.controller';

const router = express.Router();

router.route('/')
  .post(auth(), validate(createProject), projectCreate);

router.route('/user/:userId')
  .get(auth(), validate(getProjects), projectsGet);

router.route('/:projectId')
  .get(auth(), validate(getProject), projectGet)
  .delete(auth(), validate(deleteProject), projectDelete)
  .patch(auth(), validate(updateProject), projectUpdate);

router.route('/:projectId/invite')
  .patch(auth(), validate(projectMember), projectInvite);

router.route('/:projectId/invite/accept')
  .patch(validate(projectMember), projectInviteAccept);

router.route('/:projectId/invite/decline')
  .patch(validate(projectMember), projectInviteAccept);

router.route('/:projectId/members/remove')
  .patch(auth(), validate(removeMember), projectMemberRemove);


export default router;