const User = require("../../model/userModel");
const asyncErrorHandler = require("../../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const customError = require("../../Utils/customError");
const product = require("../../model/productModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //geneate token
  // const token = signToken(newUser._id)

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
  console.log(user.password);
  //  const isMatch = user.comparePasswordInDb(password, user.password)

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new customError("Invalid Email or Password", 400);
    return next(error);
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "sucess",
    token,
    user,
  });
});

//View the products by category

const productCategory = async (req, res) => {
  
};
//.module.exports = signup;
