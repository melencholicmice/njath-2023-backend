import Joi from "joi";
import bcrypt from "bcrypt";
import config from "../config/default.mjs";
import jwt from 'jsonwebtoken';

// --------- SCHEMAS --------------------
export const userSchemaRegister = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	password: Joi.string().min(8).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().required(),
	fullname: Joi.string().required(),
});

export const userSchemaLogin = Joi.object({
	password: Joi.string().min(8).required(),
	email: Joi.string().email().required(),
})

// ---------- OTHER UTILS ---------------
export async function getHash(hash) {
	return crypto.webcrypto.subtle
		.digest("SHA-256", new TextEncoder().encode(hash))
		.then((result) => Array.from(new Uint8Array(result)))
		.then((result) =>
			result.map((b) => b.toString(16).padStart(2, "0")).join("")
		)
		.then((result) => {
			return result;
		});
}

export async function hashPassword(password) {
	try {
		const salt = await bcrypt.genSalt(config.saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	} catch (e) {
		throw e;
	}
}

export async function comparePassword(inputPassword, hashedPassword) {
	try {
		const match = await bcrypt.compare(inputPassword, hashedPassword);
		return match;
	} catch (error) {
		throw error;
	}
}

export function generateJwtToken(payload){
	const options = {
  		expiresIn: config.loginExpiry
	};
	const token = jwt.sign(payload,config.jwtSecret,options);
	return token;
}

export function checkJwtToken(token){
	try{
		const decoded = jwt.verify(token,config.jwtSecret);
		return decoded
	}
	catch(error){
		throw error;
	}
}
