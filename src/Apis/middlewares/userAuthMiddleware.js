const jwt =require("jsonwebtoken");
const user = require("../../model/userModel");


const verifyToken = async(req,res,next)=>{
    const athHeader = req.headers['authorization'];
    if(!athHeader){
        res.status(404).json({
            status:'failed',
            message:'no token provide'
        })
    }
    const token = athHeader.split(' ')[1]

    if(!token){
        res.status(404).json({
            status:"error",
            message:"your not loged in"
        })
    }
    
   const verToken = await jwt.verify(token,process.env.SECRET_STR)
        
    const userId = verToken.id
    const checkById =await user.findById(userId)
    if(!checkById){
        res.status(404).json({
            status:'error',
            message:'token not found'
        })
    }
     
next()

}
module.exports = verifyToken