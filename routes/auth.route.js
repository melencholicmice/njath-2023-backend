import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validateBody.js";
import { userSchemaLogin, userSchemaRegister } from "../utils/auth.util.js";
import { checkUser } from "../middlewares/checkUser.js";
import { USER_ROLE } from "../models/user.model.js";

const authRouter = Router();

authRouter.post(
	"/register-participant",
	validateBody(userSchemaRegister),
	register
);

authRouter.get(
	"/login",
	checkUser(USER_ROLE.PARTICIPANT),
	(req,res)=>{
		return res.status(200).json({
			message:"Login succesful",
			success:true
		})
	}
)

authRouter.post(
	"/login",
	validateBody(userSchemaLogin),
	login
);

export default authRouter;
