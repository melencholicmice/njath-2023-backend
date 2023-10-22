import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validateBody.js";
import { userSchemaRegister } from "../utils/auth.util.js";

const authRouter = Router();

authRouter.post(
	"/register-participant",
	validateBody(userSchemaRegister),
	register
);
authRouter.get("/login", login);
export default authRouter;
