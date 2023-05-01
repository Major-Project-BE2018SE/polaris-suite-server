import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from './config';
import { tokenTypes } from './constant';
import { UserModel } from '../models';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const userModel = await UserModel.findById(payload.sub);
    if (!userModel) {
      return done(null, false);
    }
    done(null, userModel);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);