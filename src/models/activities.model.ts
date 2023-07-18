import mongoose from "mongoose";

interface IActivitySchema extends mongoose.Document {
  name: string;
  description: string;
  link: string;
  type: "project" | "test-case";
  status: "project-create" | "project-delete" | "comment" | "test-pass" | "test-fail" | "mentioned" | "collaborator-add" | "collaborator-remove";
  projectId: string;
  testcaseId?: string;
}

const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["project", "test-case"],
    required: true,
  },
  link: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["project-create", "project-delete", "comment", "test-pass", "test-fail", "mentioned", "collaborator-add", "collaborator-remove"],
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  testcaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestCase",
  },
}, { timestamps: true })

export const ActivityModel = mongoose.model('Activity', ActivitySchema) as unknown as mongoose.Model<IActivitySchema>;