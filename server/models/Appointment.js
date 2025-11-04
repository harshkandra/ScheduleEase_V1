import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
  purpose: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected", "cancelled"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
