const multer = require('multer')
const fs =require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({
    destination: path.join(__dirname,'public'),
    filename: (req, file, cb) =>{
      
      cb(null,Date.now()+ file.originalname )
    }
  })
  
  const upload = multer({ storage})

 


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadCloudinary = (req,res,next)=>{
upload.single('image')(req,res,async(err)=>{
  if(err){
    res.status(404).json({
      status:'error',
      message:'error'
    })
  }
  try{
  const result = await cloudinary.uploader.upload(req.file.path,{
    folder:"Pro_image"
  })
  req.body.image = result.secure_url
  fs.unlink(req.file.path,(unlink)=>{
    if(unlink){
      console.log("deleting local file",unlink);
    }
  })
  next()
}
catch (err){
res.status(500).json({
  status:'fail',
  message:'error uploading file'
})
}
})
}
module.exports = uploadCloudinary