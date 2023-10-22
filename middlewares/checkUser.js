import { User } from "../models/user.model.js";
import { checkJwtToken } from "../utils/auth.util.js";
import logger from "../utils/logger.js";

export const  checkUser =  (userRole) => {
    return async (req,res,next) => {

        const token = req.cookies.access_token;

        if(!token){
            return res.status(401).json({
                    success:false,
                    message:"Token not found"
            });
        }

        try{
            const payload = checkJwtToken(token);
            if(!payload.username || !payload.email || !payload.phone){
                return res.status(401).json({
                    success:false,
                    message:"Invalid token"
                })
            }

            const user = await User.findOne({
                username: payload.username,
                phone:payload.phone,
                email:payload.email
            }).exec();

            if(!user){
                return res.status(401).json({
                    success:false,
                    message:"Invalid token"
                })
            }

            if(user.role !== userRole){
                return res.status(403).json({
                    success:false,
                    message:"You are not authorised for this action"
                })
            }

            req.user = user;
            next();
        }
        catch(e){
            logger.error(e);
            return res.status(500).json({
                success:false,
                message:"cant complete the action"
            })
        }
    }

}