import { Question, QuestionResponse } from "../models/question.model.js";
import { Participant } from "../models/user.model.js";
import config from "../config/default.mjs"
import { frontendTobackendOrder, getClearedLevel } from "../utils/participant.util.js";
import logger from "../utils/logger.js";
import { levels } from "pino";

export const getQuestion = async (req,res)=>{
    let user = req.user;
    let level = req.query.level;
    let frontendOrder = req.query.order;

    // :TODO: implement shifting
    const order = frontendOrder;

    try{
        const response = await QuestionResponse.findOne({
            level:level,
            order:order,
            participant:user._id
        }).exec();

        if(response){
            response.opened+=1;
            await response.save();
        }
        else{
            const currUser = await Participant.findOne({_id:user._id}).exec();

            if(currUser.points < config.questionOpenPenelty){
                return res.status(401).json({
                    success:false,
                    message:"You dont have enough points to perform this action"
                })
            }

            currUser.points-=config.questionOpenPenelty;
            await currUser.save();

            const newResponse = new QuestionResponse({
                level:level,
                order:order,
                participant:user._id,
                opened:1
            })
            await newResponse.save();
        }

        const question = await Question.findOne({
            level:level,
            order:order,
        }).select('-_id title description imageUrl').exec();

        if(!question){
            return res.status(400).json({
                success:false,
                message:"Question requested doesn't exist"
            })
        }

        return res.status(200).json({
            success:true,
            data:question
        });
    }
    catch(e){
        logger.error(e);
        return res.status(500).json({
            success:false,
            message:"Action failed"
        })
    }
}

export const answerQuestion = async(req,res) => {
    const data = req.body;
    const user = req.user;

    // :TODO: implement question shifting
    const order = data.order;

    if(data.level > getClearedLevel(user)){
        return res.status(401).json({
            success:false,
            message:"Clear previous levels first"
        })
    }

    try{
        const question = await Question.findOne({
            level:data.level,
            order:order
        }).exec()

        const response = await QuestionResponse.findOne({
            level:data.level,
            order:order,
            participant:user._id
        }).exec();

        if(!response){
            return res.status(401).json({
                success:false,
                message:"You cannot answer question without opening it"
            })
        }

        if(response.isCorrect){
            return res.status(200).json({
                success:true,
                message:"You have already answered it"
            })
        }

        if(question.answer === data.answer){

            let currUser = await Participant.findById(user._id);

            currUser.points += config.rightAnswerBonous;
            currUser.correctAnswers[data.level-1].push(order);
            await currUser.save();

            response.answered++;
            response.isCorrect = true;
            await response.save();

            return res.status(200).json({
                success:true,
                message:"Congrates! your answer was correct"
            })
        }
        else{
            response.answered++;
            await response.save();

            return res.status(200).json({
                success:false,
                message:"Sorry,your answer was incorrect"
            })
        }
    }
    catch(e){
        logger.error(e);
        return res.status(500).json({
            success:false,
            message:"Action failed"
        })
    }
}

export const getHint = async (req,res) => {
    const data = req.body;
    const user = req.user;

    // :TODO: implement question shifting
    const order = data.order;
    if(data.level > getClearedLevel(user)){
        return res.status(401).json({
            success:false,
            message:"Clear previous levels first"
        })
    }

    try{
        const response = await QuestionResponse.findOne({
            level:data.level,
            order:order,
            participant:user._id
        }).exec();

        if(!response){
            return res.status(401).json({
                success:false,
                message:"You cannot get hint of question without opening it"
            })
        }

        const hint = await Question.findOne({
            level:data.level,
            order:order
        }).select('-_id hint').exec();

        if(!response.hintTaken){
            let currUser = await Participant.findById(user._id);

            if(currUser.points < config.hintPenalty){
                return res.status(401).json({
                    success:false,
                    message:"You don't have enough points to take hints"
                })
            }

            currUser.points -= config.hintPenalty;
            await currUser.save();
            response.hintTaken = true;
            await response.save();
        }

        return res.status(200).json({
            success:true,
            data:hint
        })
    }
    catch(e){
        logger.error(e);
        return res.status(500).json({
            success:false,
            message:"Action failed"
        })
    }
}

export const getLevelDetails = async (req,res) =>{
    let user = req.user;
    const level = req.query.level;

    if (!level || isNaN(Number(level))) {
        return res.status(400).json({
            success:false,
            message:'Invalid level parameter. Please provide a number.'
        });
    }

    if(level > getClearedLevel(user)){
        return res.status(401).json({
            success:false,
            message:"Clear previous levels first"
        })
    }

    try{
        const correctQuestions = await QuestionResponse.find({
            level:level,
            participant:user._id,
        }).select('-_id order isCorrect hintTaken').exec();

        const correctAnsArray = [];
        const openedQuestions = [];
        const hintOpenedQuestions = [];

        correctQuestions.map((ele)=>{
            openedQuestions.push(ele.order);

            if(ele.isCorrect){
                correctAnsArray.push(ele.order);
            }

            if(ele.hintTaken){
                hintOpenedQuestions.push(ele.order);
            }
        })

        // :TODO: implement shifting
        return res.status(200).json({
            success:true,
            data:{
                correctAnswers:correctAnsArray,
                totalQuestions:config.maxQuestioninLevel,
                hintTaken:hintOpenedQuestions,
                openedQuestions:openedQuestions
            }
        })
    }
    catch(e){
        logger.error(e);
        return res.status(500).json({
            success:false,
            message:"Action failed"
        })
    }
}

export const getLoan = async (req,res) => {
    let user = req.user;
    const level = req.query.level;
    const safe = req.query.safe;
    const frontendOrder = req.query.order;

    if (!safe || isNaN(Number(safe))) {
        return res.status(400).json({
            success:false,
            message:'Invalid safe parameter. Please provide a number.'
        });
    }
    // :TODO: implement shifting
    const order = frontendOrder;

    try{
        const currUser = await Participant.findById(user._id);

        let response = await QuestionResponse.findOne({
            level:level,
            order:order,
            participant:currUser._id
        }).exec();

        if(response){
            return res.status(401).json({
                success:false,
                message:"You have already opened this question"
            });
        }

        if(currUser.remainingLoan <= 0){
            return res.status(401).json({
                success:false,
                message:"You can't take more loan"
            });
        }


        if(safe != 0){
            console.log(safe);
            if(currUser.points > config.loanPenalty){
                return res.status(401).json({
                    success:false,
                    message:"You have enough points , you don't need to take loan"
                });
            }
        }
        response = new QuestionResponse({
            level:level,
            order:order,
            participant:user._id,
            opened:1
        });

        currUser.points-=config.loanPenalty;

        await currUser.save();
        await response.save();

        const question = await Question.find({
            level:level,
            order:order
        }).select('-_id title description imageUrl').exec();

        res.status(200).json({
            success:true,
            data:question
        });

    }
    catch(e){
        logger.error(e);
        return res.status(500).json({
            success:false,
            message:"Action failed"
        })
    }
}

export const getParticipantData = async (req,res) => {
    let levels = getClearedLevel(req.user);

    // covering a small edgecase
    if(req.user.correctAnswers[0].length < config.minQuestionToclearLevel){
        levels = 0;
    }

    return res.status(200).json({
        success:true,
        data:{
            isBanned:req.user.isBaned,
            remainingLoan:req.user.remainingLoan,
            username:req.user.username,
            email:req.user.email,
            clearedLevels: levels,
            points:req.user.points,
            totalLevel:config.maxLevels
        }
    });
}