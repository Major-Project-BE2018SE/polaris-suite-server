import httpStatus from "http-status";
import type { Request, Response } from "express";

import { CommentModel, TestCaseModel } from "../models";
import { catchAsync } from "../helpers/catchAsync";
import ApiError from "../helpers/ApiError";

const commentCreate = catchAsync(async (req: Request, res: Response) => {
  const testcase = await TestCaseModel.findById(req.params.testcaseId);
  
  if(!testcase) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Testcase not found');
  }

  const comment = await CommentModel.create(req.body);

  testcase.comments.push(comment._id);
  await testcase.save().then(testcase => testcase
    .populate({
      path: 'comments',
      populate: [
        { 
          path: 'userId',
          model: 'User',
        },
        {
          path: 'replies',
          populate: {
            path: 'userId',
            model: 'User',
          }
        }
      ],
    }));

  res.status(httpStatus.CREATED).json({ testcase });
});

const commentDelete = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentModel.findById(req.params.commentId);

  if(!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  const testcase = await TestCaseModel.findById(req.params.testcaseId)
    .then(testcase => testcase.populate({
      path: 'comments',
      populate: [
        { 
          path: 'userId',
          model: 'User',
        },
        {
          path: 'replies',
          populate: {
            path: 'userId',
            model: 'User',
          }
        }
      ],
    }));

  if(!testcase) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Testcase not found');
  }

  const newComments = testcase.comments.filter((commentId) => commentId.toString() !== req.params.commentId);
  testcase.comments = newComments;
  await testcase.save();

  for (let i = 0; i < comment.replies.length; i++) {
    await CommentModel.findByIdAndDelete(comment.replies[i]);
  }

  await comment.deleteOne();

  res.status(httpStatus.OK).send({ testcase });
});

const commentUpdate = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentModel.findById(req.params.commentId);

  if(!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  Object.assign(comment, req.body);
  await comment.save().then(comment => comment.populate('replies'));

  const testcase = await TestCaseModel.findById(req.params.testcaseId)
    .then(testcase => testcase.populate({
      path: 'comments',
      populate: [
        { 
          path: 'userId',
          model: 'User',
        },
        {
          path: 'replies',
          populate: {
            path: 'userId',
            model: 'User',
          }
        }
      ],
    }));

  res.status(httpStatus.OK).send({ testcase });
});

const replyToComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentModel.findById(req.params.commentId);

  if(!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  const reply = await CommentModel.create(req.body);

  comment.replies.push(reply._id);
  await comment.save().then(comment => comment.populate('replies'));

  const testcase = await TestCaseModel.findById(req.params.testcaseId)
    .then(testcase => testcase.populate({
      path: 'comments',
      populate: [
        { 
          path: 'userId',
          model: 'User',
        },
        {
          path: 'replies',
          populate: {
            path: 'userId',
            model: 'User',
          }
        }
      ],
    }));

  res.status(httpStatus.OK).send({ testcase });
});

const replyDelete = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentModel.findById(req.params.commentId);

  if(!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  const reply = await CommentModel.findById(req.params.replyId);

  const newReplies = comment.replies.filter(replyId => replyId.toString() !== req.params.replyId);
  comment.replies = newReplies;
  await comment.save().then(comment => comment.populate('replies'));

  await reply.deleteOne();

  const testcase = await TestCaseModel.findById(req.params.testcaseId)
    .then(testcase => testcase.populate({
      path: 'comments',
      populate: [
        { 
          path: 'userId',
          model: 'User',
        },
        {
          path: 'replies',
          populate: {
            path: 'userId',
            model: 'User',
          }
        }
      ],
    }));

  res.status(httpStatus.OK).send({ testcase });
});

const likeComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentModel.findById(req.params.commentId);

  if(!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  comment.likes.push(req.body.userId);
  await comment.save();

  const testcase = await TestCaseModel.findById(req.params.testcaseId)
    .then(testcase => testcase.populate({
      path: 'comments',
      populate: [
        { 
          path: 'userId',
          model: 'User',
        },
        {
          path: 'replies',
          populate: {
            path: 'userId',
            model: 'User',
          }
        }
      ],
    }));

  res.status(httpStatus.OK).send({ testcase });
});

const unlikeComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentModel.findById(req.params.commentId);

  if(!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  const newLikes = comment.likes.filter(userId => userId.toString() !== req.body.userId);
  comment.likes = newLikes;
  await comment.save();

  const testcase = await TestCaseModel.findById(req.params.testcaseId)
    .then(testcase => testcase.populate({
      path: 'comments',
      populate: [
        { 
          path: 'userId',
          model: 'User',
        },
        {
          path: 'replies',
          populate: {
            path: 'userId',
            model: 'User',
          }
        }
      ],
    }));

  res.status(httpStatus.OK).send({ testcase });
});

export {
  commentCreate,
  commentDelete,
  commentUpdate,
  replyToComment,
  replyDelete,
  likeComment,
  unlikeComment,
}
