const mongoose =require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'pls enter the name']
    },
    email:{
        type:String,
        required:[true, 'pls enter the email'],
        unique:true,
        lowercase: true,
        validate:[validator.isEmail,'pls enter a valid email']
    },
    photo: String,
    password: {
        type:String,
        required: [true, 'pls enter a password'],
        minlength:8
    },
    confrmPassword:{
        type:String,
        required:[true, 'pls confirm your password']
    }
})

const user = mongoose.model('user', userSchema);

module.exports = user;