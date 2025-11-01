import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      enum: ["admin", "internal user", "external user"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
