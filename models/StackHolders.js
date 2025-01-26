import mongoose from "mongoose";

const Stalkholders_schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true },
    cnic: { type: Number, required: true, unique: true },
    phNumber: { type: Number, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "receptionalist", "department"],
    },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

const StalkHolders = mongoose.model("stalkholders", Stalkholders_schema);
export default StalkHolders;
