const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const mongoose = require('mongoose')

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