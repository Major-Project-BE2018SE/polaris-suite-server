import httpStatus from "http-status";
import type { Request, Response } from "express";

import { SettingModel, ShortcutModel, UserModel } from "../models";
import { generateAuthTokens, generateResetPasswordToken, generateVerifyEmailToken, getResetPasswordToken, getVerifyEmailToken, removeToken } from "./token.controller";
import { sendEmail } from "../helpers/email";
import { emailTypes } from "../config/constant";
import { catchAsync } from "../helpers/catchAsync";
import ApiError from "../helpers/ApiError";
import axios from "axios";
import { config } from "../config/config";

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

  // creating a settings and shortcut document for the user
  await SettingModel.create({ userId: user.id });
  await ShortcutModel.create({ userId: user.id });

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

const loginWithGithub = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.body;

  const { data: tokenData } = await axios.post(
    `https://github.com/login/oauth/access_token?client_id=${config.github.oauthClientId}&client_secret=${config.github.oauthClientSecret}&code=${code}`,
    null,
    {
      headers: {
        accept: 'application/json',
      },
    }
  )

  const { data } = await axios.get(
    `https://api.github.com/user`,
    {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
      }
    }
  )
  
  const user = await UserModel.findOne({ email: data.email });

  if(user) {
    const token = await generateAuthTokens(user.id);
    res.status(httpStatus.OK).send({ user, token });
  } else {
    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      githubToken: tokenData.access_token,
      isEmailVerified: true,
    });

    await SettingModel.create({ userId: user.id });
    await ShortcutModel.create({ userId: user.id });

    const token = await generateAuthTokens(user.id);
    res.status(httpStatus.OK).send({ user, token });
  }
});

const loginWithGoogle = catchAsync(async (req: Request, res: Response) => {
  const { googleToken } = req.body;

  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${googleToken}`,
      }
    }
  )

  const user = await UserModel.findOne({ email: data.email });

  if(user) {
    const token = await generateAuthTokens(user.id);
    res.status(httpStatus.OK).send({ user, token });
  } else {
    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      googleToken,
      isEmailVerified: true,
    });

    await SettingModel.create({ userId: user.id });
    await ShortcutModel.create({ userId: user.id });

    const token = await generateAuthTokens(user.id);
    res.status(httpStatus.OK).send({ user, token });
  }
})

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
  loginWithGithub,
  loginWithGoogle,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerifyMail,
}
