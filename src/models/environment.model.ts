import mongoose from "mongoose";

interface IEnvironmentSchema extends mongoose.Document {
  name: string;
  description: string;
  variables: {
    name: string;
    value: string;
  }[];
}

const EnvironmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  variables: {
    type: [{
      name: {
        type: String,
        required: true,
        trim: true,
      },
      value: {
        type: String,
        required: true,
        trim: true,
      },
    }],
    default: [],
  }, 
}, { timestamps: true })

export const EnvironmentModel = mongoose.model('Environment', EnvironmentSchema) as unknown as mongoose.Model<IEnvironmentSchema>;