import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { emailTypes } from '../config/constant';
import { emailVerifyTemplate, passwordResetTemplate } from '../utils/emailTemplate';

const transport = nodemailer.createTransport(config.email.smtp);

export const sendEmail = async (email: string, token: string, type: string) => {

  let sub = '';
  let message = '';

  if(type === emailTypes.VERIFY_EMAIL) {
    sub = 'Email Verification for polaris suite';
    message = emailVerifyTemplate(token);    
  }
  else if(type === emailTypes.RESET_PASSWORD) {
    sub = 'Password reset for polaris suite';
    message = passwordResetTemplate(token);
  }

  const msg = { from: config.email.from, to: email, subject: sub, html: message };
  await transport.sendMail(msg);
}