import { getClearedLevel } from "../utils/participant.util.js";

export const validateLevelParams = (req, res, next) => {
    const user = req.user;
    const level = req.query.level;
    const frontendOrder = req.query.order;

    if (!level || isNaN(Number(level))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid level parameter. Please provide a number.'
        });
    }

    if (!frontendOrder || isNaN(Number(frontendOrder))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid order parameter. Please provide a number.'
        });
    }

    if (level > getClearedLevel(user)) {
        return res.status(401).json({
            success: false,
            message: "Clear previous levels first"
        })
    }

    next();
}