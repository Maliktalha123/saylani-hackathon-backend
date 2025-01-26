import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendResponse from "../helpers/SendResponse.js";
import { authenticateUser } from "../middleware/authentication.js";
import Beneficary from "../models/BenificiarySeaker.js";
import QRCode from "qrcode";

dotenv.config();
console.log("Proccess-", process.env.AUTH_SECRET);
const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  cnic: Joi.string().length(13).pattern(/^\d+$/).required(), // Exactly 13 digits
  phNumber: Joi.string().length(11).pattern(/^\d+$/).required(),

  department: Joi.string().required(),
  address: Joi.string().max(40).required(),
  purpose: Joi.string(),
});

// const loginSchema = Joi.object({
//   email: Joi.string().email({
//     minDomainSegments: 2,
//     tlds: { allow: ["com", "net"] },
//   }),
//   password: Joi.string().min(6).required(),
// });

// Route for registiring the user
router.post("/register", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return sendResponse(res, 400, null, true, error.message);

  let newUser = new User({ ...value });
  newUser = await newUser.save();

  // Generate a QR Code containing the user's unique ID
  const qrData = JSON.stringify({ userId: newUser._id });
  const qrCode = await QRCode.toDataURL(qrData); // Generate a base64 QR code

  // Add the QR code to the user's data
  newUser.qrCode = qrCode;
  await newUser.save();

  let new_User = new User({ ...value });
  new_User = await new_User.save();
  // const plainUser = newUser.toObject();
  // var token = jwt.sign(plainUser, process.env.AUTH_SECRET);
  sendResponse(res, 201, { new_User }, false, "User Registered Successfully");
});








router.post("/register-seaker", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return sendResponse(res, 400, null, true, error.message);

  let newUser = new Beneficary({ ...value });
  newUser = await newUser.save();

  // Generate a QR Code containing the user's unique ID
  const qrData = JSON.stringify({ userId: newUser._id });
  const qrCode = await QRCode.toDataURL(qrData); // Generate a base64 QR code

  // Add the QR code to the user's data
  newUser.qrCode = qrCode;
  await newUser.save();

  let new_User = new Beneficary({ ...value });
  new_User = await new_User.save();
  // const plainUser = newUser.toObject();
  // var token = jwt.sign(plainUser, process.env.AUTH_SECRET);
  sendResponse(res, 201, { new_User }, false, "User Registered Successfully");
});

// Route for Department
router.put("/update-status", async (req, res) => {
  try {
    // Extract token from the Authorization header
    const bearerToken = req?.headers?.authorization;
    const token = bearerToken?.split(" ")[1];
    if (!token) return sendResponse(res, 403, null, true, "Token not provided");

    // Verify token
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    console.log("decoded=>", decoded);

    if (!decoded) return sendResponse(res, 403, null, true, "Invalid token");

    // Update the status field for the current user's Beneficary record
    const { status } = req.body;

    const updatedSeaker = await Beneficary.findOneAndUpdate(
      { token }, // Match by the token
      { status }, // Update the status field
      { new: true } // Return the updated document
    );

    if (!updatedSeaker) {
      return sendResponse(res, 404, null, true, "Beneficary not found");
    }

    // Respond with the updated Beneficary
    sendResponse(res, 200, updatedSeaker, false, "Status updated successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, null, true, "Internal Server Error");
  }
});

router.post("/scan-qr", async (req, res) => {
  try {
    // Extract the QR code data from the request
    const { qrData } = req.body;

    // Parse the QR code data
    const { userId } = JSON.parse(qrData);

    // Find the user in the database
    const user = await User.findById(userId).lean();
    if (!user) return sendResponse(res, 404, null, true, "User not found");

    // Respond with the user's data
    sendResponse(res, 200, user, false, "User data retrieved successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, null, true, "Internal Server Error");
  }
});

router.put("/update-user/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the route parameters
    const updates = req.body; // The fields to update

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser)
      return sendResponse(res, 404, null, true, "User not found");

    // Respond with the updated user
    sendResponse(res, 200, updatedUser, false, "User updated successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, null, true, "Internal Server Error");
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the route parameters

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return sendResponse(res, 404, null, true, "User not found");

    // Respond with a success message
    sendResponse(res, 200, null, false, "User deleted successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, null, true, "Internal Server Error");
  }
});

// // Route For Receptionalist
// router.post("/add-seaker", async (req, res) => {
//   // const { error, value } = registerSchema.validate(req.body);
//   // if (error) return sendResponse(res, 400, null, true, error.message);

//   const bearerToken = req?.headers?.authorization;
//   const token = bearerToken?.split(" ")[1];
//   if (!token) return sendResponse(res, 403, null, true, "Token not provided");
//   const decoded = jwt.verify(token, process.env.AUTH_SECRET);
//   console.log("decoded=>", decoded);
//   if (decoded) {
//     const user = await User.findById(decoded._id).lean();
//     if (!user) return sendResponse(res, 403, null, true, "User not found");
//     let newSeaker = new Beneficary({
//       ...user,
//       department: req.body.department,
//       token: token,
//     });
//     newSeaker = await newSeaker.save();
//     sendResponse(res, 201, newSeaker, false, "User Registered Successfully");
//   } else {
//     sendResponse(res, 500, null, true, "Something went wrong");
//   }
// });

// router.post("/login", async (req, res) => {
//   const { error, value } = loginSchema.validate(req.body);
//   if (error) return sendResponse(res, 400, null, true, error.message);
//   const user = await User.findOne({ email: value.email }).lean();
//   if (!user)
//     return sendResponse(res, 403, null, true, "User is not registered.");

//   const isPasswordValid = await bcrypt.compare(value.password, user.password);
//   if (!isPasswordValid)
//     return sendResponse(res, 403, null, true, "Invalid Credentials.");

//   var token = jwt.sign(user, process.env.AUTH_SECRET);

//   sendResponse(res, 200, { user, token }, false, "User Login Successfully");
// });
export default router;
