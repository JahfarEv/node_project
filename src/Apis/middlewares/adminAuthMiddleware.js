const jwt = require('jsonwebtoken')

const admToken = async(req,res,next)=>{
const authHeader = req.headers['authorization']

if(!authHeader){
    res.status(404).json({
        status:'failed',
        message:'no token provided'

    })
}
const token = authHeader.split(' ')[1];

if(!token){
    res.status(404).json({
        status:'error',
        message:'your not loggedin'
    })
}

const decodeToken =await jwt.verify(token, process.env.SECRET_STR)

const isAdmin = decodeToken.isAdmin
if(!isAdmin){
    res.status(404).json({
        status:'error',
        message:'token not correct'
    })
}
next()
}

module.exports = admToken