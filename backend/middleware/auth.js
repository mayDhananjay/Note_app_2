import User from './../models/user.js'
import jwt from 'jsonwebtoken';
export const protect = async (req,res,next)=>{
    let token 
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token= req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_for_ai_studio_preview")
            
            if (global.useMemoryDb) {
                const user = global.memoryUsers.find(u => u._id.toString() === decoded.id);
                if (!user) {
                    return res.status(401).json({message: "not authorized, user not found"})
                }
                req.user = {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                };
                return next();
            }

            try {
                req.user= await User.findById(decoded.id).select("-password")
                if (!req.user) {
                    return res.status(401).json({message: "not authorized, user not found"})
                }
                return next()
            } catch (dbErr) {
                console.warn("[AI Studio] Database fetch failed in auth middleware, trying memory fallback:", dbErr.message);
                const user = global.memoryUsers.find(u => u._id.toString() === decoded.id);
                if (!user) {
                    return res.status(401).json({message: "not authorized, user not found"})
                }
                req.user = {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                };
                return next();
            }
        }catch(err){
            console.error("Token verification failed : ",err.message)
            return res.status(401).json({message: "not authorized, token failed "})
        }
    }
    return res.status(401).json({message: "not authorized, no token"})
} 

