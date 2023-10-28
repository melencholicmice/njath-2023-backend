import config from "../config/default.mjs";
import {
	Organizer,
	Participant,
	USER_ROLE,
	User,
} from "../models/user.model.js";
import {
	getHash,
	hashPassword,
	comparePassword,
	generateJwtToken,
	sendMail,
	checkJwtToken,
} from "../utils/auth.util.js";
import logger from "../utils/logger.js";

export const registerParticipant = (role) => {
	return async (req, res) => {
		const params = req.body;
		params["password"] = await hashPassword(params["password"]);
		params["role"] = role;

		try {
			let user = null;

			if (role === USER_ROLE.PARTICIPANT) {
				user = new Participant(params);
			} else {
				user = new Organizer(params);
			}

			await user.save();
			return res.status(201).json({
				success: true,
				message: "User created succesfully",
			});
		} catch (e) {
			if (e.code === 11000) {
				return res.status(409).json({
					success: false,
					message: "Some user with same fields already exists",
				});
			} else {
				logger.error(e);
				return res.status(500).json({
					success: false,
					message: "User was not created",
				});
			}
		}
	};
};

export const login = async (req, res) => {
	const userData = req.body;
	try {
		const user = await User.findOne({ email: userData.email });

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User with the provided email doesn't exist.",
			});
		}

		const match = await comparePassword(userData.password, user.password);

		if (!match) {
			return res.status(401).json({
				success: false,
				message: "Incorrect password",
			});
		}

		const payload = {
			email: user.email,
			username: user.username,
			phone: user.phone,
		};

		const acessToken = generateJwtToken(payload);

		res.cookie('access_token', acessToken, {
			maxAge: 24 * 60 * 60 * 1000,
			httpOnly: true,
			sameSite: 'None', // Allow cross-origin requests
			//	domain: '.vercel.app', // Set the domain to your frontend's domain
			path: '/', // The path for which the cookie is valid (root path in this case)i
			secure: true
		});

		return res.status(200).json({
			success: true,
			message: "Login successful",
		});
	} catch (e) {
		logger.error(e);
		return res.status(500).json({
			success: false,
			message: "Login failed, sesrver error",
		});
	}
};

export const forgetPassword = async (req, res) => {
	const userData = req.body;
	try {
		const user = await User.findOne(userData).exec();

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "No user with the given data found",
			});
		}

		const payload = {
			email: user.email,
			phone: user.phone,
			username: user.username,
		};

		const token = generateJwtToken(payload);
		const subject = "Reset Password for NJATH";
		const mailText =
			`Hello,${user.username}\n\n` +
			"Please click on the link below to reset your password\n" +
			`${config.frontendUrl}/resetPass/?token=${token}\n\n` +
			"Thank you\n\nTeam NJATH";

		let result = false;
		try {
			result = await sendMail(user.email, subject, mailText);
		} catch (e) {
			logger.error(e);
			return res.status(500).json({
				success: false,
				message: "server error",
			});
		}

		if (!result) {
			return res.status(500).json({
				success: false,
				message: "Mail not sent please provide correct credentials",
			});
		}

		return res.status(200).json({
			success: true,
			message:
				"Mail sent, please check your inbox, don't forget to check your spam as well",
		});
	} catch (e) {
		logger.error(e);
		return res.status(500).json({
			success: false,
			message: "Action failed, please try again",
		});
	}
};

export const resetPassword = async (req, res) => {
	const token = req.params.token;
	const userData = req.body;

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Token not found",
		});
	}

	try {
		const payload = checkJwtToken(token);
		if (!payload.email || !payload.phone || !payload.username) {
			return res.status(401).json({
				success: false,
				message: "Invalid token",
			});
		}

		try {
			const user = await User.findOne({
				email: payload.email,
				username: payload.username,
				phone: payload.phone,
			});

			if (!user) {
				res.status(401).json({
					success: false,
					message: "Invalid token",
				});
			}

			userData.password = await hashPassword(userData.password);

			user.password = userData.password;

			try {
				const updatedData = await user.save();
				return res.status(200).json({
					success: true,
					message: "Password succesfully reset",
				});
			} catch (e) {
				logger.error(e);
				return res.status(500).json({
					success: false,
					message: "Password reset failed",
				});
			}
		} catch (e) {
			logger.error(e);
			res.status(500).json({
				success: false,
				message: "Password reset failed",
			});
		}
	} catch (e) {
		logger.error(e);
		return res.status(401).json({
			success: false,
			message: "Invalid token",
		});
	}
};

export const logout = (req, res) => {
	try {
		res.clearCookie("access_token", {
			path: "/",
		});

		return res.status(200).json({
			success: true,
			message: "Logged out successfully",
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			success: false,
			message: "Logout failed, server error",
		});
	}
};
