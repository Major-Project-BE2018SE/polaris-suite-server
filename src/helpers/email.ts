import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { emailTypes } from '../config/constant';

const transport = nodemailer.createTransport(config.email.smtp);

export const sendEmail = async (email: string, token: string, type: string) => {

    let url = '';
    let sub = '';
    let purpose = '';
    let request = '';

    if(type === emailTypes.VERIFY_EMAIL) {
        url = `${config.frontendUrl}/verify-email?token=${token}`;
        sub = 'Email Verification for polaris suite';
        purpose = 'verify your email';
        request = 'create an account';
    }
    else if(type === emailTypes.RESET_PASSWORD) {
        url = `${config.frontendUrl}/reset-password?token=${token}`;
        sub = 'Password reset for polaris suite';
        purpose = 'reset your password';
        request = 'send a password reset request';
    }

    const message =  `Dear user,
    To ${purpose}, click on this link: <a href="${url}">${url}</a>
    If you did not ${request}, then ignore this email.`

    const msg = { from: config.email.from, to: email, subject: sub, html: message };
    await transport.sendMail(msg);
}