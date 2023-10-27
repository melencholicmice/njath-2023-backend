import { Router, application } from "express";
import { forgetPassword, login, logout, registerParticipant, resetPassword } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validateBody.js";
import { userSchemaForgetPassword, userSchemaLogin, userSchemaRegister, userSchemaResetPassword } from "../utils/auth.util.js";
import { checkUser } from "../middlewares/checkUser.js";
import { USER_ROLE } from "../models/user.model.js";

const authRouter = Router();

authRouter.post(
	"/register-participant",
	validateBody(userSchemaRegister),
	registerParticipant(USER_ROLE.PARTICIPANT)
);

authRouter.post(
	"/register-organiser",
	validateBody(userSchemaRegister),
	checkUser([USER_ROLE.ADMIN]),
	registerParticipant(USER_ROLE.ORGANIZER)
)

authRouter.get(
	"/login",
	checkUser([USER_ROLE.PARTICIPANT]),
	(req, res) => {
		return res.status(200).json({
			message: "Login succesful",
			success: true
		})
	}
)

authRouter.post(
	"/login",
	validateBody(userSchemaLogin),
	login
);

authRouter.post(
	"/forget-password",
	validateBody(userSchemaForgetPassword),
	forgetPassword
)

authRouter.post(
	"/reset-password/:token",
	validateBody(userSchemaResetPassword),
	resetPassword
)

authRouter.get(
	"/logout",
	logout
)

export default authRouter;
