import express from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

import { 
  createComment,
  deleteComment,
  updateComment,
} from '../validations/comment.validation';
import { 
  commentCreate,
  commentDelete,
  commentUpdate,
  likeComment,
  replyDelete,
  replyToComment,
  unlikeComment,
} from '../controllers/comment.controller';

const router = express.Router();

router.route('/:testcaseId')
  .post(auth(), validate(createComment), commentCreate)

router.route('/:testcaseId/:commentId')
  .delete(auth(), validate(deleteComment), commentDelete)
  .patch(auth(), validate(updateComment), commentUpdate);

router.route('/:testcaseId/:commentId/reply')
  .post(auth(), validate(updateComment), replyToComment);

router.route('/:testcaseId/:commentId/like')
  .patch(auth(), validate(updateComment), likeComment);

router.route('/:testcaseId/:commentId/unlike')
  .patch(auth(), validate(updateComment), unlikeComment);

router.route('/:testcaseId/:commentId/reply/:replyId')
  .delete(auth(), validate(updateComment), replyDelete);

export default router;