import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IUserScheme extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  isPasswordVerified(password: string): Promise<boolean>;
}

export interface UserStatics {
  isEmailTaken(email:string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value: string) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error('Password must contain at least one letter and one number');
      }
    },
    private: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true })

/**
 * 
 * Check if the email is already taken
 * @param email {string}
 * @returns {Promise<boolean>}
 */
UserSchema.statics.isEmailTaken = async function (email: string): Promise<boolean> {
  const user = await this.findOne({ email });
  return !!user;
}

/**
 * 
 * Check if the provided password matches the password in the database
 * @param password {string}
 * @returns {Promise<boolean>}
 */
UserSchema.methods.isPasswordVerified = async function (password: string): Promise<boolean> {
  const user = this;
  return await bcrypt.compare(password, user.password);
}

/**
 * 
 * Hash the password before saving the user model if password is modified
 */
UserSchema.pre('save', async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
})

export const UserModel = mongoose.model('User', UserSchema) as unknown as mongoose.Model<IUserScheme> & UserStatics;