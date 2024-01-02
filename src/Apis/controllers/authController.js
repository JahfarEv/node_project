const User = require("../../model/userModel");
const asyncErrorHandler = require("../../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const customError = require("../../Utils/customError");
const product = require("../../model/productModel");
const { default: mongoose } = require("mongoose");
const cart = require('../../model/addToCart')
const wishlist = require('../../model/wishList')


const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

exports.signup = asyncErrorHandler(async (req, res) => {
  const newUser = await User.create(req.body);
 

  res.status(201).json({
    status: "sucess",
    data: {
      user: newUser,
      
    },
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    const error = new customError(
      "please provide email ID & password for login In!",
      400
    );
    return next(error);
  }
  const user = await User.findOne({ email }).select("+password");
  

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new customError("Invalid Email or Password", 400);
    return next(error);
  }
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

//view products
exports.viewProducts = async (req, res) => {
  const products = await product.find();
  if (!products) {
    return res.status(404).json({
      status: "error",
      message: "product not found",
    });
  }
  return res.status(200).json({
    status: "succes",
    message: "product fetched succesfully",
    data: {
      products,
    },
  });
};
//Products view by category
exports.productByCategory =asyncErrorHandler (async (req, res,next) => {
  const category = req.params.category;
  const productCategory = await product.find({category});
  if (!productCategory) {
   const error = new customError("not found",404)
   return next(error)
  }
  res.status(200).json({
    status: "success",
    data: {
      productCategory,
    },
  });
})

// View a specific product

exports.productById = async (req, res,next) => {
  const productId = req.params.id
  if(!mongoose.Types.ObjectId.isValid(productId)){
    res.status(404).json({
      status:'error',
      message:'invalid id'
    })
  }
 const products = await product.findById(productId)
 if(!products){
  const error = new customError("not found",404)
  return next(error)
 }
 else{
  res.status(200).json({
    status:'succes',
    data:{
      products
    }
  })
 }
};

//add to cart
exports.addToCart =asyncErrorHandler (async(req,res,next)=>{
  const userId = req.params.id
  const productId = req.body.product;
  //  console.log(productId);
  const checkProduct = await product.findById(productId);
   console.log(checkProduct);
  if(!checkProduct){
const error = new customError("not found",404)
return next(error)
  }
  const existingCart = await cart.findOne({user:userId});
if(existingCart){
  const exProductCart = existingCart.products.indexOf(productId)
  if(exProductCart !== -1){
    next(new customError("already exist"))
  }
  else{
    existingCart.products.push(productId)
    existingCart.save()
    res.status(200).json({
      status:'sucess',
      data:{
        existingCart:existingCart
      }
    })
  }
  
}else{
  const newCart = await cart.create({User:userId,products:[productId]})
  res.status(200).json({
    status:'success',
    data:{
      newCart:newCart
    }
  })
}


}
)

