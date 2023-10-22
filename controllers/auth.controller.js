import { USER_ROLE, User } from "../models/user.model.js";
import { getHash, hashPassword ,comparePassword} from "../utils/auth.util.js";
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
			message: "user created succesfully",
		});
	} catch (e) {
		if (e.code === 11000) {
			// Duplicate key error (MongoDB error code 11000)
			return res.status(409).json({
				message: "some user with same fields already exists",
			});
		} else {
			logger.error("Duplicate key error:", e);
			return res.status(500).json({
				message: "User was not created",
			});
		}
	}
};

// :NOTE: Work in progress
// export const login = async (req , res) = {
// 	const userData = req.body;
// 	try{
// 		const user =  await User.findOne({email:userData.email})
// 		if(!user){
// 			res
// 		}

// 	}
// 	catch(e){
// 		logger.error(e)
// 		res.status(500).json({"message":"Login failed, sesrver error"})
// 	}
// 	try{
// 		const match = await comparePassword()
// 	}catch(e){

// 	}

// }