const dotenv=require('dotenv');
dotenv.config({path:'./config/config.env'})
const connectDB = require('./config/connectDB')
const app=require('./App');

connectDB()

const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})