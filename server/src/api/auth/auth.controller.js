import httpCode from "http-status-codes";
import authService from "./auth.service.js";
import { loginZodSchema } from "./auth.validator.js";
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
    if (data.role === "Admin") {
      result = await authService.adminLogin(data);
    }

    if (data.role === "User") {
      result = await authService.agentLogin(data);
    }

    return res.status(httpCode.OK).send(result);
  } catch (error) {
    print(error.message, "red");
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    
    const id = req.user?.id;
    const role = req.user?.role;

    const result = await authService.verify(id, role);
    return res.status(httpCode.OK).send(result);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};
