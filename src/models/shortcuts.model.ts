import mongoose from "mongoose";

interface IShortcutSchema extends mongoose.Document {
  shortcuts: {
    title: string;
    project: string;
  }[];
  userId: string;
}

const ShortcutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shortcuts: {
    type: [{
      title: String,
      project: String,
    }],
    default: [],
  },
}, { timestamps: true })

export const ShortcutModel = mongoose.model('Shortcut', ShortcutSchema) as unknown as mongoose.Model<IShortcutSchema>;