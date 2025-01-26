import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendResponse from "../helpers/SendResponse.js";

export async function authenticateUser(req, res, next) {
  try {
    const bearerToken = req?.headers?.authorization;
    const token = bearerToken?.split(" ")[1];
    if (!token) return sendResponse(res, 403, null, true, "Token not provided");
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    console.log("decoded=>", decoded);
    if (decoded) {
      const user = await User.findById(decoded._id).lean();
      if (!user) return sendResponse(res, 403, null, true, "User not found");
      req.user = user;
      next();
    } else {
      sendResponse(res, 500, null, true, "Something went wrong");
    }
  } catch (err) {
    sendResponse(res, 500, null, true, "Something went wrong");
  }
}

export async function authenticateAdmin(req, res, next) {
  try {
    const bearerToken = req?.headers?.authorization;
    const token = bearerToken?.split(" ")[1];
    if (!token) return sendResponse(res, 403, null, true, "Token not provided");
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);

    console.log("decoded=>", decoded);

    if (decoded) {
      const user = await User.findById(decoded._id).lean();
      if (!user) return sendResponse(res, 403, null, true, "User not found");

      if (user.role == "admin") {
        req.user = user;
        next();
      } else {
        sendResponse(res, 500, null, true, "Only admin can call this API");
      }
    } else {
      sendResponse(res, 500, null, true, "Something went wrong");
    }
  } catch (err) {
    sendResponse(res, 500, null, true, "Something went wrong");
  }
}
