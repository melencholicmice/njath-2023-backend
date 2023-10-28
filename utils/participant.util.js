import config from "../config/default.mjs"
import Joi from "joi";
import { QuestionResponse } from "../models/question.model.js";
import logger from "./logger.js";

// ---------- SCHEMAS ----------------------
export const answerQuestionSchema = Joi.object({
    level: Joi.number().min(1).max(config.maxLevels).required(),
    order: Joi.number().min(1).max(config.maxQuestioninLevel).required(),
    answer: Joi.alternatives().try(
        Joi.string(),
        Joi.number()
    ).required()
})


export const hintSchema = Joi.object({
    level: Joi.number().min(1).max(config.maxLevels).required(),
    order: Joi.number().min(1).max(config.maxQuestioninLevel).required()
})


// -------------- GENERAL UTILS -------------
export const getSumFromPhone = (phoneNumber) => {
    const digitArray = phoneNumber.split('').map(Number);
    const sum = digitArray.reduce((acc, digit) => acc + digit, 0);
    return sum;
}

export const frontendTobackendOrder = (frontendOrder, phoneNumber) => {
    const sum = getSumFromPhone(phoneNumber);

    const shift = sum % config.maxQuestioninLevel;

    frontendOrder += config.maxQuestioninLevel;
    frontendOrder -= shift;

    return frontendOrder;
}

export const backendToFrontendOrder = (backendOrder, phoneNumber) => {
    const sum = getSumFromPhone(phoneNumber);

    const order = ((backendOrder + sum) % config.maxQuestioninLevel);

    if (order === 0) {
        order += config.maxQuestioninLevel;
    }

    return backendOrder;
}

export const getClearedLevel = async (user) => {
    const userId = user._id;
    let clearedLevel = 1;

    for (let i = 1; i < config.maxLevels; i++) {
        try {
            const solvedQuestions = await QuestionResponse.find({
                level: i,
                isCorrect: true,
                participant: userId,
            }).exec();

            if (solvedQuestions.length >= config.minQuestionToclearLevel) {
                clearedLevel++;
            }

        } catch (e) {
            throw e;
        }
    }
    return clearedLevel;
}