import nodemailer from 'nodemailer';
import { config } from '../config/config';

export const transport = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass
  }
});
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => console.info('Connected to email server'))
    .catch(() => console.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} body
 * @returns {Promise}
 */
export const sendEmail = async (to: string, subject: string, body: string): Promise<any> => {
  const msg = { from: config.email.from, to, subject, html: body };
  await transport.sendMail(msg);
};