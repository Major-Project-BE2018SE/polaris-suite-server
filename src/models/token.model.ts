import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    type: {
        type: String,
        enum: ["refresh", "resetPassword", "verifyEmail"],
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export const TokenModel = mongoose.model("Token", TokenSchema);