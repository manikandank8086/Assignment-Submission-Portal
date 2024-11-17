import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  email: { type: String, require: true },
  phone: { type: String },
  username: { type: String },
  password: { type: String },
  role: { type: String, enum: ["user", "admin"], required: true },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
