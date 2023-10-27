import mongoose from "mongoose";
import config from "../config/default.mjs";

const QuestionSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    hint: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        default: null
    },

    level: Number,

    order: Number,
})

const QuestionResponseSchema = new mongoose.Schema({
    level: Number,

    order: Number,

    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant'
    },

    opened: {
        type: Number,
        default: 0
    },

    answered: {
        type: Number,
        default: 0
    },

    isCorrect: {
        type: Boolean,
        default: false
    },

    hintTaken: {
        type: Boolean,
        default: false
    },
})

export const Question = mongoose.model("Question", QuestionSchema);
export const QuestionResponse = mongoose.model("QuestionResponse", QuestionResponseSchema);


