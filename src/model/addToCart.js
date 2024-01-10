const mongoose = require('mongoose');
const user = require('./userModel');
const product = require('./productModel');
const cartModel = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:user

    },
    products:[
        {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:product

    }],
    totalPrice:{

        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        default:1
       
    }
})

const cart = mongoose.model("cart",cartModel);
module.exports = cart