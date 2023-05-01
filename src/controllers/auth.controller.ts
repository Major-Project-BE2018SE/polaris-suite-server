import { Request, Response } from "express";
import { UserModel } from "../models";
import httpStatus from "http-status";
import { generateAuthTokens, generateResetPasswordToken, getResetPasswordToken, getVerifyEmailToken, removeToken } from "./token.controller";
import { sendEmail } from "../helpers/email";
import { emailTypes } from "../config/constant";

/**
 * 
 * register new user to the system
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const register = async (req: Request, res: Response) => {
   
    if(await UserModel.isEmailTaken(req.body.email)) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'Email is already taken' });
    }

    const user = await UserModel.create(req.body);
    const token = await generateAuthTokens(user.id);

    res.status(httpStatus.CREATED).json({ user, token });
}

/**
 * 
 * login user to the system
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if(!user || !(await user.isPasswordVerified(password))) {
        return res.status(httpStatus.UNAUTHORIZED).send({ message: 'Incorrect email or password' });
    }

    const token = await generateAuthTokens(user.id);

    res.status(httpStatus.OK).send({ user, token });
}

/**
 * 
 * logout user from the system
 * @param {Request} req 
 * @param {Response} res 
 */
const logout = async (req: Request, res: Response) => {
    await removeToken(req.body.refreshToken);
    res.status(httpStatus.OK).send({ message: 'Logout' });
}

/**
 * 
 * request for a reset password email
 * @param {Request} req 
 * @param {Response} res 
 */
const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const resetPasswordToken = await generateResetPasswordToken(res, email);
    await sendEmail(email, resetPasswordToken, emailTypes.RESET_PASSWORD);

    res.status(httpStatus.OK).send({ message: 'Reset password email sent successfully' });    
}

/**
 * 
 * reset the user password
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const resetPassword = async (req: Request, res: Response) => {
    const { resetPasswordToken, newPassword } = req.body;

    const resetPasswordTokenDoc = await getResetPasswordToken(resetPasswordToken);
    if(!resetPasswordTokenDoc) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid token' });
    }
    await UserModel.updateOne({ _id: resetPasswordTokenDoc.user }, { password: newPassword });
    await removeToken(resetPasswordTokenDoc.id);

    res.status(httpStatus.OK).send({ message: 'Password reset successfully' });
}

/**
 * 
 * request a verification email
 * @param {Request} req 
 * @param {Response} res 
 */
const sendVerifyMail = async (req: Request, res: Response) => {
    const { email } = req.body;

    const verifyEmailToken = await generateResetPasswordToken(res, email);
    await sendEmail(email, verifyEmailToken, emailTypes.VERIFY_EMAIL);

    res.status(httpStatus.OK).send({ message: 'Verify email sent successfully' });
}

/**
 * 
 * verify the user email
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const verifyEmail = async (req: Request, res: Response) => {
    const { verifyEmailToken } = req.body;

    const verifyEmailTokenDoc = await getVerifyEmailToken(verifyEmailToken);
    if(!verifyEmailTokenDoc) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid token' });
    }
    await UserModel.updateOne({ _id: verifyEmailTokenDoc.user }, { isEmailVerified: true });
    await removeToken(verifyEmailTokenDoc.id);

    res.status(httpStatus.OK).send({ message: 'Email verified successfully' });
}

export {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    sendVerifyMail,
}
