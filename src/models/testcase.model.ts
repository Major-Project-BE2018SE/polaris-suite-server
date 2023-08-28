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
    name: string,
    params: Array<any>,
    functionType: "inbuilt" | "custom" | "not-function",
    path: string | null,
    inbuiltFunction: "suite" | "expect" | "test" | "api" | "call" | "component" | "page" | "polaris-none",
    returns: string | null,
    anonymousTestChildren: "next-test" | number | null,
    siblingTest: "next-test" | number | null, 
    customSchema: string | null,
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
      params: Array,
      functionType: {
        type: String,
        enum: ["inbuilt", "custom", "not-function"],
      },
      path: String || null,
      inbuiltFunction: {
        type: String,
        enum: ["suite", "expect", "test", "api", "call", "component", "page", "polaris-none"],
      },
      returns: String || null,
      anonymousTestChildren: String || Number || null,
      siblingTest: String || Number || null,
      customSchema: String || null,
    }],
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