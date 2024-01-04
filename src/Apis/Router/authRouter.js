const express = require('express');
const authController = require('../controllers/userController');
const verifyToken = require('../middlewares/userAuthMiddleware');

const router = express.Router();


router.post('/register',(authController.signup))
.post('/login',(authController.login))
.use(verifyToken)
.get('/products',(authController.viewProducts))
.get('/category/:category',(authController.productByCategory))
.get('/product/:id',(authController.productById))
.post('/cart/:id',(authController.addToCart))
.post('/wishlist/:id',(authController.proWishList))









module.exports = router;