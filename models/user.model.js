import mongoose from "mongoose";
import config from "../config/default.mjs";
import { InitialiseEmptyMatrix } from "../utils/auth.util.js";

export const USER_ROLE = {
	PARTICIPANT: "PARTICIPANT",
	ADMIN: "ADMIN",
	ORGANIZER: "ORGANIZER",
};

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
		unique: true,
	},
	fullname: {
		type: String,
		required: true,
	},
});

const participantSchema = new mongoose.Schema({
	isBaned: {
		type: Boolean,
		default: false,
	},
	points: {
		type: Number,
		default: config.initialPoints,
	},
	remainingLoan: {
		type: Number,
		default: config.allowedLoan
	},
	correctAnswers: {
		type: [[Number]],
		default: InitialiseEmptyMatrix
	}
});

const adminSchema = new mongoose.Schema({
	// :NOTE: just a placeholder
	adminCommonField: String,
});

const organizerSchema = new mongoose.Schema({
	// :NOTE: just a placeholder
	organizerCommonField: String,
});

export const User = mongoose.model("User", UserSchema);

export const Participant = User.discriminator("Participant", participantSchema);
export const Admin = User.discriminator("Admin", adminSchema);
export const Organizer = User.discriminator("Organizer", organizerSchema);
