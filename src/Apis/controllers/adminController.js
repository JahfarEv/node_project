const jwt = require('jsonwebtoken')
const adminLogin = async(req,res)=>{
    const{email,password} = req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        const token = jwt.sign({email:email},process.env.ADMIN_SECRET_STR)
        res.status(200).json({
            status:'sucess',
            data:{
                token
            }
        })
    }
    else{
        res.status(401).json({
            message:'error'
        })
    }

}

module.exports = {
    adminLogin
}