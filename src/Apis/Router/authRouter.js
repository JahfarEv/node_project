const express = require('express');
const authController = require('../controllers/userController');
const verifyToken = require('../middlewares/userAuthMiddleware');

const router = express.Router();


router.post('/register',(authController.signup))
.post('/login',(authController.login))
.use(verifyToken)
.get('/products',(authController.viewProducts))
.get('/category/:categoryname',(authController.productByCategory))
.get('/product/:id',(authController.productById))
.post('/cart/:id',(authController.addToCart))
.get('/viewcart',(authController.Cart))
.post('/wishlist/:id',(authController.proWishList))
.get('/viewlist',(authController.wishList))
.post('/payments/:id',(authController.payments))









module.exports = router;