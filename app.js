import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/default.mjs";
import logger from "./utils/logger.js";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import { connectdb } from "./utils/connectDb.js";

const app = express();

// -----------MIDDLEWARE-------------
app.use(cors());
app.use(express.json());
app.use(cookieParser())

//  :TODO: Move it somewhere else
morgan.token("pino-logger", (req, res) => {
	// all it does is print incoming http request
	logger.info({ method: req.method, url: req.originalUrl }, "HTTP Request");
	return "";
});
app.use(morgan(":pino-logger"));


// -----------ROUTES---------------

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke 💩");
});

app.use("*", (req, res, next) => {
	return res.status(404).json({
		message: "Not found",
	});
});


// -----------START SERVER------------
// :TODO: find some better way to start server
app.listen(config.port, () => {
	logger.info("🚀 Server is running on port 8080");
});
connectdb();