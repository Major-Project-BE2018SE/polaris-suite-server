import jwt from 'jsonwebtoken';
import moment from 'moment';
import type { Moment } from 'moment';
import type { ObjectId } from 'mongoose';
import type { Response } from 'express';

import { TokenModel, UserModel } from '../models';
import { tokenTypes } from '../config/constant';
import { config } from '../config/config';

/**
 * 
 * generate new token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {TokenType} type
 * @param {string} secret
 * @returns 
*/
const generateToken = (userId: ObjectId, expires: Moment, type: string, secret: string = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type: type
    };
    const token = jwt.sign(payload, secret);
    return token;
}

/**
 * 
 * save the token to the database
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {TokenType} type
 * @param {boolean} blacklisted
 * @returns Promise<typeof TokenModel>
*/
const saveToken = async (token: string, userId: ObjectId, expires: Moment, type: string, blacklisted: boolean = false) => {
    const tokenDoc = await TokenModel.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
};

/**
 * 
 * generate auth tokens
 * @param {ObjectId} userId
 * @returns 
*/
export const generateAuthTokens = async (userId: ObjectId) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(userId, accessTokenExpires, tokenTypes.ACCESS);
  
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(userId, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(refreshToken, userId, refreshTokenExpires, tokenTypes.REFRESH);
  
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
*/
export const generateResetPasswordToken = async (_: Response, email: string): Promise<string> => {
    const user = await UserModel.findOne({ email });
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
  };
  
/**
* Generate verify email token
* @param {ObjectId} userId
* @returns {Promise<string>}
*/
export const generateVerifyEmailToken = async (userId: ObjectId): Promise<string> => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(userId, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, userId, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
};

/**
 * 
 * remove the token from the database
 * @param {ObjectId} token 
 */
export const removeToken = async (token: ObjectId) => {
    await TokenModel.deleteOne({ token });
}

/**
 * 
 * verify token and return token document (or throw an error if it is not valid)
 * @param {string} token 
 * @returns 
 */
export const getResetPasswordToken = async (token: string) => {
    const resetPasswordTokenDoc = await TokenModel.findOne({
      token,
      type: tokenTypes.RESET_PASSWORD,
      blacklisted: false,
    });
    if (!resetPasswordTokenDoc) {
      throw new Error('Token not found');
    }
    return resetPasswordTokenDoc;
}

/**
 * 
 * verify and return token document (or throw an error if it is not valid)
 * @param {string} token 
 * @returns 
 */
export const getVerifyEmailToken = async (token: string) => {
    const verifyEmailTokenDoc = await TokenModel.findOne({
      token,
      type: tokenTypes.VERIFY_EMAIL,
      blacklisted: false,
    });
    if (!verifyEmailTokenDoc) {
      throw new Error('Token not found');
    }
    return verifyEmailTokenDoc;
}