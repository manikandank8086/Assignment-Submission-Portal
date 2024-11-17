import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    task: { type: String, required: true },
    admin: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  });
  
  // Add a compound index to make userId and task unique together
  assignmentSchema.index({ userId: 1, task: 1 }, { unique: true });
  
  const AssignmentModel = mongoose.model("Assignment", assignmentSchema);
  
  export default AssignmentModel;
  