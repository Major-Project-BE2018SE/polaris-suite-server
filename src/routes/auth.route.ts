import express from 'express';
import { forgotPassword, login, loginWithGithub, loginWithGoogle, logout, register, resetPassword, sendVerifyMail, verifyEmail } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { VerifyMailSend, forgotPasswordValidate, loginValidate, loginWithGithubValidate, loginWithGoogleValidate, logoutValidate, registerValidate, resetPasswordValidate, verifyEmailValidate } from '../validations/auth.validation';

const router = express.Router();

router.post('/register', validate(registerValidate), register);
router.post('/login', validate(loginValidate), login);
router.post('/login/google', validate(loginWithGoogleValidate), loginWithGoogle);
router.post('/login/github', validate(loginWithGithubValidate), loginWithGithub);
router.post('/logout', validate(logoutValidate), logout);
router.post('/forgot-password', validate(forgotPasswordValidate), forgotPassword);
router.post('/reset-password', validate(resetPasswordValidate), resetPassword);
router.post('/verify-email', validate(verifyEmailValidate), verifyEmail);
router.post('/send-verification-email', validate(VerifyMailSend), sendVerifyMail);

export default router;