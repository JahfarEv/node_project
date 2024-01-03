const jwt =require("jsonwebtoken")
const verifyToken = (req,res,next)=>{
    const athHeader = req.headers['authorization'];
    if(!athHeader){
        res.status(404).json({
            status:'failed',
            message:'no token provide'
        })
    }
    const token = athHeader.split(' ')[1]
    
    jwt.verify(token,process.env.SECRET_STR,(err,decode)=>{
        if(err){
            res.status(401).json({
                status:'error',
                message:'unautherized'
            })
        }
        req.email = decode.email
        next()
        })


}
module.exports = verifyToken