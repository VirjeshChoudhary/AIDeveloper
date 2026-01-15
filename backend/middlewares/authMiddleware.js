import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import redisClient from "../services/redisService.js";
export const authUser=async (req,res,next) => {
   try {
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "Unauthorized, no token provided"});
    }
    const blacklistedToken=await redisClient.get(token);
    if(blacklistedToken){
        res.cookies('token','');
        return res.status(401).json({message: "Unauthorized, token is blacklisted"});
    }
    const decode=jwt.verify(token,process.env.JWT_SECRET);
    if(!decode){
        res.status(401).json({message : "user can't verify"});
    }
    // console.log(decode,"Decoded Token");
    const user=await User.findById(decode._id);
    req.user=user;
    // console.log(req.user,"AUthenticated User");
    next();
   } catch (error) {
    res.status(500).json({message: 'Internal Server Error profile' , error: error.message});
   } 
}

