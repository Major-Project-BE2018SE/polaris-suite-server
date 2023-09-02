import express from 'express';
import { validate } from '../middlewares/validate';
import { createTestCase, updateTestCase, deleteTestCase, getTestCase, getTestCases, getTestCasesAll, createTestCaseAll } from '../validations/testcase.validation';
import { auth } from '../middlewares/auth';
import { testCaseAllCreate, testCaseCreate, testCaseDelete, testCaseGet, testCaseRun, testCaseUpdate, testCasesAllGet, testCasesGet } from '../controllers/testcase.controller';

const router = express.Router();

router.route('/:projectId')
  .post(auth(), validate(createTestCaseAll), testCaseAllCreate)
  .get(auth(), validate(getTestCasesAll), testCasesAllGet);

router.route('/:projectId/:environmentId')
  .post(auth(), validate(createTestCase), testCaseCreate)
  .get(auth(), validate(getTestCases), testCasesGet);

router.route('/:projectId/:environmentId/:testcaseId')
  .get(auth(), validate(getTestCase), testCaseGet)
  .delete(auth(), validate(deleteTestCase), testCaseDelete)
  .patch(auth(), validate(updateTestCase), testCaseUpdate);

router.route('/:projectId/:environmentId/:testcaseId/runTest')
  .post(auth(), testCaseRun);

export default router;