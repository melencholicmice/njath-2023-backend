import Joi from "joi";
import bcrypt from "bcrypt";
import config from "../config/default.mjs";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import logger from "./logger.js";

// --------- SCHEMAS --------------------
export const userSchemaRegister = Joi.object({
	username: Joi.string().min(3).max(30).required(),
	password: Joi.string().min(8).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().pattern(/^[0-9]+$/).required(),
	fullname: Joi.string().required(),
});

export const userSchemaLogin = Joi.object({
	password: Joi.string().min(8).required(),
	email: Joi.string().email().required(),
})

export const userSchemaForgetPassword = Joi.object({
	email: Joi.string().email().required(),
	phone: Joi.string().pattern(/^[0-9]+$/).required(),
})

export const userSchemaResetPassword = Joi.object({
	password: Joi.string().min(8).required(),
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

export function generateJwtToken(payload) {
	const options = {
		expiresIn: config.loginExpiry
	};
	const token = jwt.sign(payload, config.jwtSecret, options);
	return token;
}

export function checkJwtToken(token) {
	try {
		const decoded = jwt.verify(token, config.jwtSecret);
		return decoded
	}
	catch (error) {
		throw error;
	}
}

export async function sendMail(to, subject, text) {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: config.smtpEmail,
			pass: config.appPassword,
		},
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false,
		},
	})

	const mailData = {
		from: config.smtpEmail,
		to: to,
		subject: subject,
		text: text,
	}

	try {
		await transporter.sendMail(mailData);
		return true;
	}
	catch (e) {
		logger.error(e);
		return false;
	}
}

export function InitialiseEmptyMatrix() {
	let matrix = [];
	let emptyArray = [];

	for (let i = 0; i < config.maxLevels; i++) {
		matrix.push(emptyArray);
	}

	return matrix;
}