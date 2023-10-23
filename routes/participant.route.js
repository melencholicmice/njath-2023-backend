import { Router } from "express";
import { answerQuestion, getCorrectAnswer, getHint, getQuestion } from "../controllers/participant.controller.js";
import { validateBody } from "../middlewares/validateBody.js";
import { answerQuestionSchema, hintSchema } from "../utils/participant.util.js";


const participantRoutes = Router();

participantRoutes.get(
    "/question",
    getQuestion
)

participantRoutes.get(
    "/get-correct-answer",
    getCorrectAnswer
)

participantRoutes.post(
    "/check-answer",
    validateBody(answerQuestionSchema),
    answerQuestion
)

participantRoutes.post(
    "/get-hint",
    validateBody(hintSchema),
    getHint
)


export default participantRoutes;