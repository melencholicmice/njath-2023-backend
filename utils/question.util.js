import Joi from "joi";
import config from "../config/default.mjs"

export const addQuestionSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string().required(),
	imageUrl: Joi.string().uri({ allowRelative: false }),
	hint: Joi.string().required(),
	answer: Joi.string().required(),
	level: Joi.number().min(1).max(config.maxLevels).required()
})