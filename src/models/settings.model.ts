import mongoose from "mongoose";

interface ISettingSchema extends mongoose.Document {
  theme: "light" | "dark" | "system";
  github: {
    enabled: boolean;
    installationId: string;
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
      installationId: {
        type: String,
        default: "",
      }
    },
    default: {
      enabled: false,
      installationId: "",
    },
  }
}, { timestamps: true })

export const SettingModel = mongoose.model('Setting', SettingSchema) as unknown as mongoose.Model<ISettingSchema>;