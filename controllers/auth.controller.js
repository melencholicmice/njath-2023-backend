import config  from "../config/default.mjs";
import { Organizer, Participant, USER_ROLE, User } from "../models/user.model.js";
import { getHash, hashPassword ,comparePassword, generateJwtToken} from "../utils/auth.util.js";
import logger from "../utils/logger.js";


export const registerParticipant = (role) => {
	return async (req, res) => {
		const params = req.body;
		params["password"] = await hashPassword(params["password"]);
		params["role"] = role;

		try {
			let user = null;

			if(role === USER_ROLE.PARTICIPANT){
				user = new Participant(params);
			}
			else{
				user = new Organizer(params);
			}

			await user.save();
			return res.status(201).json({
				success:true,
				message: "user created succesfully",
			});
		} catch (e) {
			if (e.code === 11000) {
				// Duplicate key error (MongoDB error code 11000)
				return res.status(409).json({
					success:false,
					message: "some user with same fields already exists",
				});
			} else {
				logger.error(e);
				return res.status(500).json({
					success:false,
					message: "User was not created",
				});
			}
		}
};
}


export const registerOrganiser = async(req,res) => {

}

export const login = async (req , res) => {
	const userData = req.body;
	try{
		const user =  await User.findOne({email:userData.email})

		if(!user){
			res.status(401).json({
				success:false,
				message:"Incorrect email"
			});
		}

		try{
			const match = await comparePassword(userData.password,user.password);

			if(!match){
				res.status(401).josn({
					success:false,
					message:"Incorrect password"
				});
			}

			const payload = {
				email:user.email,
				username:user.username,
				phone:user.phone
			}

			const acessToken = generateJwtToken(payload);

			res.cookie('access_token', acessToken, {
			    // httpOnly: true,
			    maxAge: config.cookieExpiry,
			});

			return res.status(200).json({
				success:true,
				message: 'Login successful'
			});

		}catch(e){
			logger.error(e);
			return res.status(500).json({
			    success: false,
			    message: 'An error occurred during login',
			});
		}
	}
	catch(e){
		logger.error(e)
		res.status(500).json({
			success:false,
			message:"Login failed, sesrver error"
		})
	}

}