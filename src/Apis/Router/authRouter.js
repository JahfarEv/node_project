const express = require('express');
const authController = require('../controllers/userController');
const verifyToken = require('../middlewares/userAuthMiddleware');

const router = express.Router();


router.post('/register',(authController.signup))
.post('/login',(authController.login))
.get('/payment/success',(authController.paymentSuccess))
.use(verifyToken)
.get('/products',(authController.viewProducts))
.get('/category/:categoryname',(authController.productByCategory))
.get('/product/:id',(authController.productById))
.post('/cart/:id',(authController.addToCart))
.get('/viewcart',(authController.Cart))
.post('/cart/remove/:id',(authController.deleteFromCart))
.post('/wishlist/:id',(authController.proWishList))
.get('/viewlist',(authController.wishList))
.post('/orders/:id',authController.orderdProduct)
.post('/payments/:id',(authController.payments))









module.exports = router;