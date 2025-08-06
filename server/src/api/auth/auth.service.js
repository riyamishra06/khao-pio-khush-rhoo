import { Madmin } from "../../models/admin.model.js";
import { MUser } from "../../models/user.model.js";

const adminLogin = async (data) => {
  const admin = await Madmin.findOne({
    email: data.email,
    password: data.password,
  });

  if (admin) {
    const token = await admin.generateToken();

    if (token) {
      return {
        message: "admin logged in successfully",
        role: "admin",
        token,
      };
    }
  } else {
    throw new Error("admin credential are wrong");
  }
};

const userLogin = async (data) => {
  const user = await MUser.findOne({
    email: data.email,
    role: data.role,
  });

  if (!user || !(await user.comparePassword(data.password))) {
    throw new Error("User credential are wrong");
  }

  if (user) {
    const token = await user.generateToken();

    if (token) {
      return {
        message: "User logged in successfully",
        role: "user",
        token,
      };
    }
  } else {
    throw new Error("User not found");
  }
};

const verify = async (id, _role) => {
  var username = "";
  var role = "";

  if (_role === "admin") {
    const result = await Madmin.findById(id);
    username = result?.name;
    role = "admin";
  }

  if (_role === "user") {
    const result = await MUser.findById(id);
    username = result?.username;
    role = result?.role;
  }
  return {
    data: {
      username,
      role,
    },
    success: true,
  };
};

export default {
  verify,
  adminLogin,
  userLogin,
};
