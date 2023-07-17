import mongoose from "mongoose";

interface ICommentSchema extends mongoose.Document {
  comment: string;
  userId: string;
  likes: string[];
  replies: string[];
}

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  replies: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }],
    default: [],
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    default: [],
  }
}, { timestamps: true })

export const CommentModel = mongoose.model('Comment', CommentSchema) as unknown as mongoose.Model<ICommentSchema>;