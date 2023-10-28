import { config } from "dotenv";
config();

export default {
	port: process.env.PORT,
	dbUrl: process.env.MONGODB_URL,
	jwtSecret: process.env.JWT_SECRET,
	appPassword: process.env.APP_PASSWORD,
	smtpEmail: process.env.SMTP_EMAIL,
	frontendUrl: process.env.FRONTEND_URL,
	initialPoints: 25,
	saltRounds: 10,
	allowedLoan: 2,
	loginExpiry: '300h',
	cookieExpiry: 1080000, // recommended to keep loginExpiry and cookie expiry the same
	maxLevels: 6,
	maxQuestioninLevel: 8,
	questionOpenPenelty: 10,
	wrongAnswerPenalty: 15,
	rightAnswerBonous: 20,
	hintPenalty: 5,
	minQuestionToclearLevel: 6,
	loanPenalty: 20
};
