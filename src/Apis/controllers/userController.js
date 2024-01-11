const User = require("../../model/userModel");
const asyncErrorHandler = require("../../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const customError = require("../../utils/customError");
const product = require("../../model/productModel");
const { default: mongoose } = require("mongoose");
const cart = require("../../model/addToCart");
const wishlist = require("../../model/wishList");
const user = require("../../model/userModel");
const { Stripe } = require("stripe");
const orders = require("../../model/orderSchema");

const signToken = (id) => {
  return jwt.sign({ id, isAdmin: false }, process.env.SECRET_STR, {
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
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "please provide email & password for login In!",
    });
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    res.status(500).json({
      status: "error",
      message: "invalid email or password",
    });
  }
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

//view products
exports.viewProducts = asyncErrorHandler(async (req, res) => {
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
});
//Products view by category
exports.productByCategory = asyncErrorHandler(async (req, res) => {
  const categoryName = req.params.categoryname;
 
  const productCategory = await product.find({ category: categoryName });
  console.log(productCategory);

  if (productCategory.length === 0) {
    return res.status(404).json({
      status: "error",
      message: "product not found",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        product: productCategory,
      },
    });
  }
});

// View a specific product

exports.productById = asyncErrorHandler(async (req, res, next) => {
  const productId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(500).json({
      status: "error",
      message: "invalid id",
    });
  }
  const products = await product.findById(productId);
  if (!products) {
   res.status(500).json({
    status:'error',
    message:'invalid id'
   })
  } else {
    res.status(200).json({
      status: "succes",
      data: {
        products,
      },
    });
  }
});

//add to cart
exports.addToCart = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.id;
  const productId = req.body.product;
  const checkProduct = await product.findById(productId);
  console.log(checkProduct);
  if (!checkProduct) {
    res.status(404).json({
      status:'error',
      message:'not found'
    })
  }
  let newExistingCart = await cart.findOne({ user: userId });
  if (newExistingCart) {
    let exProductCart = newExistingCart.products.indexOf(productId);
    console.log(exProductCart);
    if (exProductCart !== -1) {
    newExistingCart.quantity += 1
    console.log(newExistingCart.quantity);
      res.status(500).json({
        status:'error',
        message:'product allready exist'
      })
    } else {
      newExistingCart.products.push(productId);
      newExistingCart.totalPrice += checkProduct.price;
      newExistingCart.quantity+=1
      newExistingCart.save();
      res.status(200).json({
        status: "success",
        data: {
          existingCart: newExistingCart,
        },
      });
    }
  } else {
    const newCart = await cart.create({ user: userId, products: [productId] });
    res.status(200).json({
      status: "success",
      data: {
        newCart: newCart,
      },
    });
  }
});

//view cart

exports.Cart = asyncErrorHandler(async (req, res) => {
  const viewCart = await cart.find();
  if (!viewCart) {
    res.status(404).json({
      status: "error",
      message: "cart is empty",
    });
  }
  res.status(200).json({
    status: "succes",
    data: {
      viewCart,
    },
  });
});

//Delete products from cart

exports.deleteFromCart = asyncErrorHandler(async (req, res) => {
  const userId = req.params.id;
  const productId = req.body.product;

  const findCart = await cart.findOne({ user: userId });

  if (!findCart) {
    res.status(404).json({
      status: "failed",
      message: "not found",
    });
  }
  const index = findCart.products.indexOf(productId);
  const removeProduct = findCart.products[index];
  findCart.products.splice(removeProduct, 1);

  await findCart.save();
  res.status(200).json({
    status: "success",
  });
});

//Add to wishList
exports.proWishList = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.id;
  const productId = req.body.product;
  const checkProduct = await product.findById(productId);
  if (!checkProduct) {
    res.status(404).json({
      status: "error",
      message: "not found",
    });
  }
  const existingCart = await wishlist.findOne({ user: userId });

  if (existingCart) {
    const existingProductCart = existingCart.items.indexOf(productId);

    if (existingProductCart !== -1) {
      next(customError("already exist", 404));
    }
    existingCart.items.push(productId);
    existingCart.save();
    res.status(200).json({
      status: "succes",
      data: {
        existingCart,
      },
    });
  }
  const newWishList = await wishlist.create({
    userr: userId,
    items: [productId],
  });
  res.status(200).json({
    status: "succes",
    data: {
      newWishList,
    },
  });
});

//view wish list

exports.wishList = asyncErrorHandler(async (req, res) => {
  const viewWishList = await wishlist.find();

  if (!viewWishList) {
    res.status(404).json({
      status: "error",
      message: "wish list is empty",
    });
  }
  res.status(200).json({
    status: "succes",
    data: {
      viewWishList,
    },
  });
});

//payments
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.payments = asyncErrorHandler(async (req, res) => {
  const userId = req.params.id;
  const userr = await user.findById({ _id: userId });
  const findCart = await cart.findOne({ user: userId });
  const prod = await product.find({ _id: findCart.products });
  if (!userr) {
    res.status(200).json({
      status: "succes",
      message: "your cart is empty",
      data: [],
    });
  }

  const customer = await stripe.customers.create({
    name: userr.name,
    address: {
      line1: "ettuveettil",
      city: "vengara",
      state: "kerala",
      postal_code: "123456",
      country: "IN",
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: prod.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    }),
    mode: "payment",
    success_url: "http://localhost:4000/api/users/payment/success",
    cancel_url: "http://localhost:4000/api/users/payment/cancel",
  });

  if (session) {
    const order = new orders ({
      usr:findCart.user,
      prodts:prod,
      order_Id:session.id,
      total_Price:findCart.totalPrice,
      total_Items:findCart.products.length,
      order_status:session.payment_status
    })

    await order.save()
    res.status(200).json({
      status:'success',
      session:session.url
    })
  }
  else{
    res.status(404).json({
      status:failed
    })
  }
})

exports.paymentSuccess = (req, res) => {
  res.send("<h1>success</h1>");
};
