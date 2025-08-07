import httpCode from "http-status-codes";
import authService from "./auth.service.js";
import { loginZodSchema, registerZodSchema } from "./auth.validator.js";
import { zodError } from "../../utils/zodErrorFormat.js";
import print from "../../utils/print.js";

export const login = async (req, res) => {
  const { error, data } = loginZodSchema.safeParse(req.body);

  if (error) {
    const result = zodError(error.errors);
    return res.status(httpCode.BAD_REQUEST).send({ error: result });
  }

  try {
    var result;
    if (data.role === "admin") {
      result = await authService.adminLogin(data);
    }

    if (data.role === "user") {
      result = await authService.userLogin(data);
    }

    if (!result) {
      return res.status(httpCode.BAD_REQUEST).send({ error: "Invalid role specified" });
    }

    return res.status(httpCode.OK).send(result);
  } catch (error) {
    print(error.message, "red");
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const id = req.user?.userId || req.user?.adminId;
    const role = req.user?.role;

    if (!id || !role) {
      return res.status(httpCode.UNAUTHORIZED).send({ error: "Invalid token data" });
    }

    const result = await authService.verify(id, role);
    return res.status(httpCode.OK).send(result);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Register new admin (for initial setup)
export const adminRegister = async (req, res) => {
  const { error, data } = registerZodSchema.safeParse(req.body);

  if (error) {
    const result = zodError(error.errors);
    return res.status(httpCode.BAD_REQUEST).send({ error: result });
  }

  try {
    const result = await authService.adminRegister(data);
    return res.status(httpCode.CREATED).send(result);
  } catch (error) {
    print(error.message, "red");
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Register new user
export const userRegister = async (req, res) => {
  const { error, data } = registerZodSchema.safeParse(req.body);

  if (error) {
    const result = zodError(error.errors);
    return res.status(httpCode.BAD_REQUEST).send({ error: result });
  }

  try {
    const result = await authService.userRegister(data);
    return res.status(httpCode.CREATED).send(result);
  } catch (error) {
    print(error.message, "red");
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};
