const dotenv = require('dotenv')
const path = require('path')
const mongoose = require('mongoose')
dotenv.config({path: path.join(__dirname,'config.env')});
  
const connectDB = async ()=>{
   // console.log(process.env.LOCl_CON_DB);
   try {
    await mongoose.connect(process.env.LOCL_CON_DB)
    console.log('connect sucessfull');
   } catch (error) {
    console.error(error)
   }

}
module.exports = connectDB