import mongoose from "mongoose";
import logger from "./logger.js";
import config from "../config/default.mjs";

export const connectdb = async () => {
	try {
		await mongoose.connect(config.dbUrl);
		logger.info("🚀 DB connected ");
	} catch (e) {
		logger.error(`DB connection error :- ${e}`);
	}
};
