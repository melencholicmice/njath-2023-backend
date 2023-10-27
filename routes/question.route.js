import { Router } from "express";
import { checkUser } from "../middlewares/checkUser.js";
import { USER_ROLE } from "../models/user.model.js";
import { addQuestion } from "../controllers/question.controller.js";
import { validateBody } from "../middlewares/validateBody.js";
import { addQuestionSchema } from "../utils/question.util.js";

const questionRouter = Router();

questionRouter.post(
    "/add-question",
    checkUser([USER_ROLE.ORGANIZER, USER_ROLE.ADMIN]),
    validateBody(addQuestionSchema),
    addQuestion
);

export default questionRouter;