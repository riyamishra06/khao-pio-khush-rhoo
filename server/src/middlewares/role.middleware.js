import httpCode from "http-status-codes";
import { hasAccess } from "../utils/roleVerify.js";

export const roleCheck = (req, res, next) => {
  if (req.method === "GET") {
    return next();
  }
  if (req.url.includes("/document")) {
    return next();
  }

  const route = req.baseUrl.split("api/")[1];
  const role = req.user?.role;

  if (hasAccess(route, role)) {
    return next();
  }

  return res.status(httpCode.UNAUTHORIZED).send({ error: "Unauthorized Role" });
};
