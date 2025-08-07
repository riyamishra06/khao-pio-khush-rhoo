import httpCode from "http-status-codes";

// Role-based access control middleware
export const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(httpCode.UNAUTHORIZED).send({
          error: "User role not found"
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(httpCode.FORBIDDEN).send({
          error: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      return res.status(httpCode.INTERNAL_SERVER_ERROR).send({
        error: "Role verification failed"
      });
    }
  };
};
