import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["internal", "external", "admin"], default: "internal" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);


// server/models/User.js
const { Schema } = mongoose;

const userSchema2 = new Schema({
  googleId: String,
});

//mongoose.model('users', userSchema);