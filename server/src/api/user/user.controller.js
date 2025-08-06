import userService from "./user.service.js";
import httpCode from "http-status-codes";
import { userZodSchema } from "./user.validator.js";
import { zodError } from "../../utils/zodErrorFormat.js";

const createUser = async (req, res) => {
  const result = userZodSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues); // now `.errors` is correct
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const user = await userService.createUser(result.data);
    return res.status(httpCode.CREATED).send(user);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  const users = await userService.getUsers(req.query);
  try {
    return res.status(httpCode.OK).send(users);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await userService.deleteUser(id);

    return res
      .status(httpCode.OK)
      .send({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const { data, error } = userZodSchema.safeParse(req.body); // To validate the the fields

    if (error) {
      // Error handle for fields are empty and not valid
      const result = zodError(error.errors);
      return res.status(httpCode.BAD_REQUEST).send({ error: result });
    }

    const result = await userService.updateUser(id, data);

    return res.status(httpCode.OK).send(result);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

export default { createUser, getUsers, deleteUser, updateUser };
