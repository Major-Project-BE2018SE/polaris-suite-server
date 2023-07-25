import httpStatus from "http-status";
import type { Request, Response } from "express";

import { SettingModel, UserModel } from "../models";
import { generateAuthTokens, generateResetPasswordToken, generateVerifyEmailToken, getResetPasswordToken, getVerifyEmailToken, removeToken } from "./token.controller";
import { sendEmail } from "../helpers/email";
import { emailTypes } from "../config/constant";
import { catchAsync } from "../helpers/catchAsync";
import ApiError from "../helpers/ApiError";

/**
 * 
 * register new user to the system
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const register = catchAsync(async (req: Request, res: Response) => {   
  if(await UserModel.isEmailTaken(req.body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const user = await UserModel.create(req.body);
  const token = await generateAuthTokens(user.id);

  await SettingModel.create({ userId: user.id });

  await sendEmail(user.email, token.refresh.token, emailTypes.VERIFY_EMAIL);

  res.status(httpStatus.CREATED).json({ user, token });
});

/**
 * 
 * login user to the system
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if(!user || !(await user.isPasswordVerified(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  const token = await generateAuthTokens(user.id);

  res.status(httpStatus.OK).send({ user, token });
});

/**
 * 
 * logout user from the system
 * @param {Request} req 
 * @param {Response} res 
 */
const logout = catchAsync(async (req: Request, res: Response) => {
  await removeToken(req.body.refreshToken);
  res.status(httpStatus.OK).send({ message: 'Logout' });
});

/**
 * 
 * request for a reset password email
 * @param {Request} req 
 * @param {Response} res 
 */
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  if(!await UserModel.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No such email found');
  }

  const resetPasswordToken = await generateResetPasswordToken(res, email);
  await sendEmail(email, resetPasswordToken, emailTypes.RESET_PASSWORD);
  
  res.status(httpStatus.OK).send({ message: 'Reset password email sent successfully' });    
});

/**
 * 
 * reset the user password
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { password } = req.body;
  const { token } = req.query;
  
  const resetPasswordTokenDoc = await getResetPasswordToken(token as string);
  if(!resetPasswordTokenDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token');
  }
  const user = await UserModel.findById({ _id: resetPasswordTokenDoc.user });
  Object.assign(user, { password });
  await user.save();
  await removeToken(resetPasswordTokenDoc.id);

  res.status(httpStatus.OK).send({ message: 'Password reset successfully' });
});

/**
 * 
 * request a verification email
 * @param {Request} req 
 * @param {Response} res 
 */
const sendVerifyMail = catchAsync(async (req: Request, res: Response) => {
  const { userId, email } = req.body;
  
  const verifyEmailToken = await generateVerifyEmailToken(userId);
  if(!verifyEmailToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No such email found');
  }
  await sendEmail(email, verifyEmailToken, emailTypes.VERIFY_EMAIL);
  
  res.status(httpStatus.OK).send({ message: 'Verify email sent successfully' });
});

/**
 * 
 * verify the user email
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;
  
  const verifyEmailTokenDoc = await getVerifyEmailToken(token as string);
  if(!verifyEmailTokenDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token');
  }
  await UserModel.updateOne({ _id: verifyEmailTokenDoc.user }, { isEmailVerified: true });
  await removeToken(verifyEmailTokenDoc.id);
  
  res.status(httpStatus.OK).send({ message: 'Email verified successfully' });
});

export {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerifyMail,
}
