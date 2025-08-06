import { MAdmin } from "../../models/admin.model.js";
import { MUser } from "../../models/user.model.js";

const adminLogin = async (data) => {
  const admin = await MAdmin.findOne({
    email: data.email,
    password: data.password,
  });

  if (admin) {
    const token = await admin.generateToken();

    if (token) {
      return {
        message: "Admin logged in successfully",
        role: "Admin",
        token,
      };
    }
  } else {
    throw new Error("Admin credential are wrong");
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
        role: "User",
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

  if (_role === "Admin") {
    const result = await MAdmin.findById(id);
    username = result?.name;
    role = "Admin";
  }

  if (_role === "User") {
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
