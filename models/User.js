import mongoose from "mongoose";

const user_schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    phNumber: { type: String, required: true },
    qrCode: { type: String },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    address: { type: String, required: true },
    purpose: { type: String },
    status: { type: String, default: "activated" },
    department:{type:String,enum:["bank","hospital"]}
  },
  { timestamps: true }
);

const User = mongoose.model("user", user_schema);
export default User;
