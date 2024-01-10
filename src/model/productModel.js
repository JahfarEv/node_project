const mongoose = require("mongoose");
const productModel = new mongoose.Schema({
    title:String,
    Image:String,
    price:{type : Number , required:true},
    description: String,
    category:String,
    quantity:Number

});

const product = mongoose.model("product",productModel)
module.exports = product
