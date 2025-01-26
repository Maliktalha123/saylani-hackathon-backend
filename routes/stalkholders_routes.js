import express from "express";
import { authenticateAdmin } from "../middleware/authentication.js";
import Joi from "joi";
import StalkHolders from "../models/StackHolders.js";
import jwt from "jsonwebtoken";
import sendResponse from "../helpers/SendResponse.js";
import bcrypt from "bcrypt";
import Beneficary from "../models/BenificiarySeaker.js";
import User from "../models/User.js";
const router = express.Router();
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  cnic: Joi.string().length(13).pattern(/^\d+$/).required(), // Exactly 13 digits
  phNumber: Joi.string().length(11).pattern(/^\d+$/).required(),
  password: Joi.string().min(5).max(30).required(),
  address: Joi.string().max(40).required(),
  role:Joi.string(),
  address: Joi.string().max(40).required(),
});
const loginSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});



// Route for registiring the stalkholders
router.post("/register", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return sendResponse(res, 400, null, true, error.message);
  const hashedPassword =await bcrypt.hash(value.password,11)
  value.password = hashedPassword
  let newHolder = new StalkHolders({ ...value });
  newHolder = await newHolder.save();
  sendResponse(res, 201, newHolder, false, "stalkHolder Registered Successfully");
});





// Route for logging inn the stalkholders
router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return sendResponse(res, 400, null, true, error.message);
  const stalkHolder = await StalkHolders.findOne({ name: value.name }).lean();
  if (!stalkHolder)
    return sendResponse(res, 403, null, true, "stalkHolder is not registered.");
  const isPasswordValid = await bcrypt.compare(value.password, stalkHolder.password);
  if (!isPasswordValid)
    return sendResponse(res, 403, null, true, "Invalid Credentials.");
  var token = jwt.sign(stalkHolder, process.env.AUTH_SECRET);

  sendResponse(res, 200, { stalkHolder, token }, false, "stalkHolder Login Successfully");
});

// Route for getting all benificciaries
router.get("/benificiaries",  async (req, res) => {
  const beneficiary = await User.find().lean();
  sendResponse(res, 200, beneficiary, false, "All StalkHolders");

});

// Route for getting all StalkHolders
router.get("stalkholders", async (req, res) => {
  const stalkHolders = await StalkHolders.find().lean();
  sendResponse(res, 200, stalkHolders, false, "All StalkHolders");
});












export default router;