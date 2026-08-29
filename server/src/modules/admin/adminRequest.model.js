import mongoose from "mongoose";

const adminRequestSchema = new mongoose.Schema(
    {
        userId: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
    },{
        timestamps: true
    }
);
export const AdminRequest = mongoose.model("adminRequest", adminRequestSchema);


