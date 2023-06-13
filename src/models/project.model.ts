import mongoose from "mongoose";

interface IProjectSchema extends mongoose.Document {
    name: string;
    description: string;
    ownerID: string;
    members: string[];
    status: string;
    environments: {
        name: string;
        description: string;
        slug: string;
        variables: {
            name: string;
            value: string;
        }[];
    }[];
}

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: {
        type: [{ 
            id: mongoose.Schema.Types.ObjectId, 
            role: { 
                type: String, 
                enum: ["tester", "developer", "stakeholder"] 
            } 
        }],
        ref: "User",
        default: [],
    },
    environments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Environment",
        }],
        default: [],
    },
    status: {
        type: String,
        enum: ["archieved", "hold", "in progress", "done", "draft"],
        default: "draft",
    }
}, {
    timestamps: true,
})

export const ProjectModel = mongoose.model('Project', ProjectSchema) as unknown as mongoose.Model<IProjectSchema>;