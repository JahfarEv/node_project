const express = require('express')
const adminRouter = express.Router()
const adminController = require('../controllers/adminController')
const uploadCloudinary = require('../middlewares/multer')


adminRouter.post('/login',(adminController.adminLogin))
.get('/users',(adminController.allUsers))
.get('/users/:id',(adminController.getUserById))
.post('/addProduct',uploadCloudinary,adminController.createProduct)
.delete('/delete/:id',(adminController.deleteProduct))
.patch('/update/:id',(adminController.updateProduct))
.get('/category/:category',(adminController.allProduct))
.get('/product/:id',(adminController.specificProduct))

module.exports = adminRouter