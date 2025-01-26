import mongoose from "mongoose";

const beneficiary_schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true },
    cnic: { type: Number, required: true, unique: true },
    phNumber: { type: Number, required: true },
    qrCode: { type: String },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    address: { type: String, required: true },
    purpose: { type: String },
    department :{type:String, enum:["hospital", "bank"]},
    status: { type: String, default: "pending" },

  },
  { timestamps: true }
);

const Beneficary = mongoose.model("beneficiary", beneficiary_schema);
export default Beneficary;
