const mongoose = require('mongoose')
const user = require('./userModel')
const product = require('./productModel')
const wishlistSchema = new mongoose.Schema({
    userr:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:user
    },
    items:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:product
    }]

})

const wishlist = mongoose.model("wishlist",wishlistSchema)
module.exports =wishlist