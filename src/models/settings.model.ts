import mongoose from "mongoose";

interface ISettingSchema extends mongoose.Document {
  theme: "light" | "dark" | "system";
  github: {
    enabled: boolean;
    token: string;
    username: string;
    repos: string[];
  };
  userId: string;
}

const SettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  theme: {
    type: String,
    enum: ["light", "dark", "system"],
    default: "system",
  },
  github: {
    type: {
      enabled: {
        type: Boolean,
        default: false,
      },
      token: {
        type: String,
        default: "",
      },
      username: {
        type: String,
        default: "",
      },
      repos: {
        type: [String],
        default: [],
      },
    },
    default: {
      enabled: false,
      token: "",
      username: "",
      repos: [],
    },
  }
}, { timestamps: true })

export const SettingModel = mongoose.model('Setting', SettingSchema) as unknown as mongoose.Model<ISettingSchema>;