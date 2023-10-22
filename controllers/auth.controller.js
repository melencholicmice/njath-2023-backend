import { USER_ROLE, User } from "../models/user.model.js";
import { getHash, hashPassword ,comparePassword, generateJwtToken} from "../utils/auth.util.js";
import logger from "../utils/logger.js";


export const login2 = async (req, res) => {
	const pair = req.body;
	getHash(pair.hash).then((result) => {
		if (creds.find((cred) => cred.id == pair.id && cred.hash === result))
			res.status(200).send("Correct");
		else res.status(401).send("Incorrect");
	});
};

export const register = async (req, res) => {
	const params = req.body;
	params["password"] = await hashPassword(params["password"]);
	params["role"] = USER_ROLE.PARTICIPANT;

	try {
		const user = new User(params);
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
			logger.error("Duplicate key error:", e);
			return res.status(500).json({
				success:false,
				message: "User was not created",
			});
		}
	}
};


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
			    httpOnly: true,
			    maxAge: tokenExpiration,
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