const jwt = require("jsonwebtoken");
const user = require("../../model/userModel");
const CustomError = require("../../Utils/customError");
const { default: mongoose } = require("mongoose");
const product = require("../../model/productModel")
const asyncErrorHandler = require('../../Utils/asyncErrorHandler')
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email: email }, process.env.ADMIN_SECRET_STR);
    res.status(200).json({
      status: "sucess",
      message: "sucessfully admin login",
      data: {
        token,
      },
    });
  } else {
    res.status(401).json({
      status: "not found",
      message: "invalid admin",
    });
  }
};

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
    next(new CustomError("User not found", 404));
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

const createProduct = asyncErrorHandler(async (req, res, next) => {
  const newProduct = await product.create(req.body);
  
  res.status(201).json({
    status: "sucess",
    data: {
      product: newProduct,
    },
  });
});

//all products by category
const allProduct = asyncErrorHandler (async(req,res,next)=>{
const proCtegory = req.params.category
console.log(proCtegory);
const productCategory =await product.findOne(proCtegory)

if(!productCategory){
  const error = new CustomError("product not found", 400);
    return next(error);
}
res.status(200).json({
  status:'success',
  data:{
    productCategory

  }
})
}
)


module.exports = {
  adminLogin,
  allUsers,
  getUserById,
  createProduct,
  allProduct
};
