import { config } from "dotenv";
config();

export default {
	port: process.env.PORT,
	dbUrl: process.env.MONGODB_URL,
	jwtSecret: process.env.JWT_SECRET,
	initialPoints: 100,
	saltRounds: 10,
	allowedLoan:2,
	loginExpiry:'300h',
	cookieExpiry:1080000, // recommended to keep loginExpiry and cookie expiry the same
};
