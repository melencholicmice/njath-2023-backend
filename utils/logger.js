/**
 * Utility to use instead of boring console.log
 * Define configurations for logging info here
 */

import pino from "pino";

const logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:standard",
			ignore: "pid,hostname",
			messageFormat: " {msg}",
			levelFirst: true,
		},
	},
});

export default logger;
