import { config } from "dotenv";
config();

export default {
	port: process.env.PORT,
	initialPoints: 100,
	saltRounds: 10,
	dbUrl: process.env.MONGODB_URL,
};
