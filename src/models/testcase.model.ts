import mongoose from "mongoose";

interface ITestCaseSchema extends mongoose.Document {
  name: string;
  description: string;
  creatorId: string;
  status: "in progress" | "in review" | "done";
  type: "unit" | "integration" | "component" | "api" | "e2e";
  recentRun: "pass" | "fail" | null;
  linkedProject: string;
  environment: string;
  testRuns: {
    result: string;
    status: "pass" | "fail";
    logs: string[];
    initiatedBy: string;
    createdAt: Date;
  }[];
  testSchema: {
    name: String,
    params: Array<any>,
    returns: string | null,
    children: Array<Pick<ITestCaseSchema, "testSchema">>,
    customSchema: string | null,
    customFunctions: {name: string, path: string}[],
  }[];
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["in progress", "in review", "done"],
    default: "in progress",
  },
  type: {
    type: String,
    enum: ["unit", "integration", "component", "api", "e2e"],
  },
  recentRun: {
    type: String,
    enum: ["pass", "fail"],
  },
  linkedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  environment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Environment",
    required: true,
  },
  testRuns: {
    type: [{
      result: String,
      status: {
          type: String,
          enum: ["pass", "fail"],
      },
      logs: [String],
      initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: Date,
    }],
    default: [],
  },
  testSchema: {
    type: [{
      name: String,
      params: Array,
      returns: String || null,
      children: Array,
      customSchema: String || null,
      customFunctions: Array,
    }]
  },
  comments: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }],
    default: [],
  }
}, { timestamps: true })

export const TestCaseModel = mongoose.model('TestCase', TestCaseSchema) as unknown as mongoose.Model<ITestCaseSchema>;