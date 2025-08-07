import { Madmin } from "../../models/admin.model.js";
import { MUser } from "../../models/user.model.js";

const adminLogin = async (data) => {
  const admin = await Madmin.findOne({
    email: data.email,
    isActive: true
  });

  if (!admin || !(await admin.comparePassword(data.password))) {
    throw new Error("Invalid admin credentials");
  }

  // Update last login
  await admin.updateLastLogin();

  const token = admin.generateToken();

  return {
    message: "Admin logged in successfully",
    role: "admin",
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    }
  };
};

const userLogin = async (data) => {
  const user = await MUser.findOne({
    email: data.email,
    role: "user"
  });

  if (!user || !(await user.comparePassword(data.password))) {
    throw new Error("Invalid user credentials");
  }

  const token = user.generateToken();

  return {
    message: "User logged in successfully",
    role: "user",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  };
};

const verify = async (id, _role) => {
  try {
    if (_role === "admin") {
      const admin = await Madmin.findById(id).select('-password');
      if (!admin || !admin.isActive) {
        throw new Error("Admin not found or inactive");
      }
      return {
        data: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        },
        success: true,
      };
    }

    if (_role === "user") {
      const user = await MUser.findById(id).select('-password');
      if (!user) {
        throw new Error("User not found");
      }
      return {
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        success: true,
      };
    }

    throw new Error("Invalid role");
  } catch (error) {
    throw new Error(`Verification failed: ${error.message}`);
  }
};

// Admin registration (for initial setup)
const adminRegister = async (data) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Madmin.findOne({ email: data.email });
    if (existingAdmin) {
      throw new Error("Admin with this email already exists");
    }

    const admin = new Madmin({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || "admin",
      permissions: data.permissions || ["manage_users", "manage_foods", "view_analytics"]
    });

    await admin.save();

    const token = admin.generateToken();

    return {
      message: "Admin registered successfully",
      role: "admin",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    };
  } catch (error) {
    throw new Error(`Admin registration failed: ${error.message}`);
  }
};

// User registration
const userRegister = async (data) => {
  try {
    // Check if user already exists
    const existingUser = await MUser.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const user = new MUser({
      username: data.username,
      email: data.email,
      password: data.password,
      role: "user"
    });

    await user.save();

    const token = user.generateToken();

    return {
      message: "User registered successfully",
      role: "user",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    throw new Error(`User registration failed: ${error.message}`);
  }
};

export default {
  verify,
  adminLogin,
  userLogin,
  adminRegister,
  userRegister,
};
