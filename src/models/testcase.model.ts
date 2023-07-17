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
    name: string;
    description: string;
    params: {
      name: string;
      value: string;  
    }[] | null;
    returns: string | number | boolean | Array<any> | Object | null | undefined;
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
        required: true,
      },
      createdAt: Date,
    }],
    default: [],
  },
  testSchema: {
    type: [{
      name: String,
      description: String,
      params: {
        type: [{
          name: String,
          value: String,
        }] || null,
      },
      returns: {
        type: String || Number || Boolean || Array || Object || null || undefined,
      },
    }],
    default: [],
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