const jwt = require("jsonwebtoken");
const user = require("../../model/userModel");
const CustomError = require("../../utils/customError");
const { default: mongoose } = require("mongoose");
const product = require("../../model/productModel")
const asyncErrorHandler = require('../../utils/asyncErrorHandler')



const adminLogin =asyncErrorHandler (async (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token  = jwt.sign({ email,isAdmin:true }, process.env.SECRET_STR
      , {
      expiresIn: process.env.LOGIN_EXPIRES,
    });

    res.status(200).json({
      status: "sucess",
      message: "sucessfully admin login",
      token
    });
  } else {
    res.status(401).json({
      status: "not found",
      message: "invalid admin",
    });
  }
}
);

//all users

const allUsers = asyncErrorHandler(async (req, res) => {
  const AllUsers = await user.find();
  if (!AllUsers) {
    res.status(404).json({
      status: "error",
      message: "user not found",
    });
  } else {
    res.status(200).json({
      status: "sucess",
      message: "All Users Listed Successfully!",
      data: {
        AllUsers,
      },
    });
  }
});

//get userBy id

const getUserById = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      status: "error",
      message: "invalid user id format",
    });
  }

  const users = await user.findById(userId);
  if (!users) {
   res.status(404).json({
    status:'error',
    message:'user not found'

   })
  } else {
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  }
});


//create products

const createProduct = asyncErrorHandler(async (req, res) => {
  const {title,image,price,description,category } = req.body;
  const newProduct = await product.create({title,Image:image,price,description,category});
  console.log(image);
  res.status(201).json({
    status: "sucess",
    data: {
      product: newProduct,
    },
  });
}
);

//delete product

const deleteProduct =asyncErrorHandler (async(req,res)=>{
const deleteId = req.params.id;
// console.log(deleteId);

if(!deleteId||!mongoose.Types.ObjectId.isValid(deleteId)){
  return res.status(404).json({
    status:'error',
    message:'invalid product id provided'
  })
}

const deleteproduct = await product.findOneAndDelete({ _id:deleteId})
console.log(deleteproduct);
if(!deleteproduct){
  return res.status(404).json({
    status:'error',
    message:'product not found'
  })
}
return res.status(200).json({
  status:'succes',
  message:'product deleted succesfully',
  
})
}
)

// update products

const updateProduct =asyncErrorHandler (async(req,res)=>{
  const id = req.params.id
  if(!id||!mongoose.Types.ObjectId.isValid(id)){
    res.status(404).json({
      status:'error',
      message:'invalid product id'
    })
  }
  const updatedProduct = await product.findByIdAndUpdate({_id:id})
  if(!updatedProduct){
    res.status(404).json({
      status:'error',
      message:'product not found'
    })
  }
  res.status(200).json({
    status:'succes',
    message:'product updated',
    data:{
      product:updatedProduct
    }
  })
}
)

//all products by category
const allProduct = asyncErrorHandler (async(req,res,next)=>{
const category = req.params.category
const productCategory =await product.find({category})
console.log(productCategory);
if(!productCategory){
 res.status(404).json({
  status:'failed',
  message:'product not found'
 })
}
res.status(200).json({
  status:'success',
  data:{
    productCategory:productCategory

  }
})
}
)

//view specific product

const specificProduct =asyncErrorHandler (async(req,res,next)=>{
const productId =req.params.id
if(!mongoose.Types.ObjectId.isValid(productId)){
  res.status(404).json({
    status:'error',
    message:'invalid id'
  })
}
const productById = await product.findById(productId)
console.log(productById);
if(!productById){
  res.status(404).json({
    status:'error',
    message:'not found'
  })
}
res.status(200).json({
  status:'succes',
  data:{
    productById
  }
})
}

)

module.exports = {
  adminLogin,
  allUsers,
  getUserById,
  createProduct,
  allProduct,
  specificProduct,
  deleteProduct,
  updateProduct
};
