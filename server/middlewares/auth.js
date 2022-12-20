import Pangolin from "../models/Pangolin.js";
export default async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const pangolin = await Pangolin.findByToken(token);
        if (!pangolin) {
            throw error;
        }
        req.pangolin = pangolin;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide." });
    }
};