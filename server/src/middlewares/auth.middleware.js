import jwt from "jsonwebtoken";
import httpCode from "http-status-codes";
import config from "../config/app.config.js";
import { MUser } from "../models/user.model.js";
import { Madmin } from "../models/admin.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(httpCode.UNAUTHORIZED).send({ 
        error: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if it's a user token
    if (decoded.userId) {
      const user = await MUser.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(httpCode.UNAUTHORIZED).send({ 
          error: "Invalid token. User not found." 
        });
      }
      req.user = { 
        userId: user._id, 
        role: user.role, 
        email: user.email,
        username: user.username
      };
    }
    // Check if it's an admin token
    else if (decoded.adminId) {
      const admin = await Madmin.findById(decoded.adminId).select("-password");
      if (!admin || !admin.isActive) {
        return res.status(httpCode.UNAUTHORIZED).send({ 
          error: "Invalid token. Admin not found or inactive." 
        });
      }
      req.user = { 
        adminId: admin._id, 
        role: admin.role, 
        email: admin.email,
        username: admin.username,
        permissions: admin.permissions
      };
    } else {
      return res.status(httpCode.UNAUTHORIZED).send({ 
        error: "Invalid token format." 
      });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(httpCode.UNAUTHORIZED).send({ 
        error: "Token expired. Please login again." 
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(httpCode.UNAUTHORIZED).send({ 
        error: "Invalid token." 
      });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).send({ 
      error: "Authentication error." 
    });
  }
};

export const adminOnlyMiddleware = (req, res, next) => {
  if (!req.user || (!req.user.adminId && req.user.role !== "admin")) {
    return res.status(httpCode.FORBIDDEN).send({ 
      error: "Access denied. Admin privileges required." 
    });
  }
  next();
};

export const userOnlyMiddleware = (req, res, next) => {
  if (!req.user || !req.user.userId) {
    return res.status(httpCode.FORBIDDEN).send({ 
      error: "Access denied. User account required." 
    });
  }
  next();
};
