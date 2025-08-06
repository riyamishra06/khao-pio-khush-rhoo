import { Router } from "express";
import controller from "./user.controller.js";
import { roleCheck } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", roleCheck, controller.getUsers);
router.post("/", controller.createUser);
router.put("/:id", roleCheck, controller.updateUser);
router.delete("/:id", roleCheck, controller.deleteUser);

export default router;
