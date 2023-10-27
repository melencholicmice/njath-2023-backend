import { Router } from "express";
import { answerQuestion, getLevelDetails, getHint, getLoan, getParticipantData, getQuestion, getLeaderBoard } from "../controllers/participant.controller.js";
import { validateBody } from "../middlewares/validateBody.js";
import { answerQuestionSchema, hintSchema } from "../utils/participant.util.js";
import { validateLevelParams } from "../middlewares/validateLevelParam.js";

const participantRoutes = Router();

participantRoutes.get(
    "",
    getParticipantData
);

participantRoutes.get(
    "/question",
    validateLevelParams,
    getQuestion
);

participantRoutes.get(
    "/get-level-details",
    getLevelDetails
);

participantRoutes.post(
    "/check-answer",
    validateBody(answerQuestionSchema),
    answerQuestion
);

// :TODO: rewrite it into get api
participantRoutes.post(
    "/get-hint",
    validateBody(hintSchema),
    getHint
);

participantRoutes.get(
    "/get-loan",
    validateLevelParams,
    getLoan
);

participantRoutes.get(
    "/leaderboard",
    getLeaderBoard
)


export default participantRoutes;