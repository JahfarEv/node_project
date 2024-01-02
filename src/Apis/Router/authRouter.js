const express = require('express');
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares.js/userAuthMiddleware');

const router = express.Router();


router.post('/signup',(authController.signup))
.post('/login',(authController.login))
.use(verifyToken)
.get('/viewproducts',(authController.viewProducts))
.get('/category/:id',(authController.productByCategory))
.get('/product/:id',(authController.productById))
.post('/:id/cart',(authController.addToCart))
.post('/:id/wishlist',(authController.wishlist))








module.exports = router;