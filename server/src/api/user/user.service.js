import { MUser } from "../../models/user.model.js";
import { isValidObjectId } from "mongoose";

const createUser = async (data) => {
  // Check if user already exist
  const userExist = await MUser.findOne({ email: data.email });

  if (userExist) {
    throw new Error("User already exist");
  }

  const user = new MUser({
    ...data,
    role: "user",
  });

  await user.save();
  
  return {
    message: "User created successfully",
  };
};

const getUsers = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  let searchQuery = {};

  if (typeof query.search === "string" && query.search.trim() !== "") {
    const search = query.search.trim();
    searchQuery = {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }

  const projection = {
    password: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  };

  const [users, total] = await Promise.all([
    MUser.find(searchQuery, projection).skip(skip).limit(limit),
    MUser.countDocuments(searchQuery), // ✅ Apply search filter here too
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

const deleteUser = async (id) => {
  if (!id) {
    throw new Error("User id is required");
  }

  // Check if user id is valid
  if (!isValidObjectId(id)) {
    throw new Error("Invalid user id");
  }

  const userExist = await MUser.findById(id);
  if (!userExist) {
    throw new Error("User not found");
  }

  const result = await MUser.deleteOne({ _id: id });
  return result;
};

const updateUser = async (id, data) => {
  if (!id) {
    throw new Error("User id is required");
  }

  // Check if user id is valid
  if (!isValidObjectId(id)) {
    throw new Error("Invalid user id");
  }

  const userExist = await MUser.findById(id);
  if (!userExist) {
    throw new Error("User not found");
  }

  await MUser.updateOne({ _id: id }, data);

  return {
    message: "User updated successfully",
  };
};

export default {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
};
