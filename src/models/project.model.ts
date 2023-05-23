import mongoose from "mongoose";

interface IProjectSchema extends mongoose.Document {
    name: string;
    description: string;
    ownerID: string;
    members: string[];
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
    }
}, {
    timestamps: true,
})

export const ProjectModel = mongoose.model('Project', ProjectSchema) as unknown as mongoose.Model<IProjectSchema>;