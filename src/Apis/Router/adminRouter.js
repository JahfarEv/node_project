const express = require('express')
const adminRouter = express.Router()
const adminController = require('../controllers/adminController')


adminRouter.post('/login',(adminController.adminLogin))
.get('/users',(adminController.allUsers))
.get('/users/:id',(adminController.getUserById))
.post('/product',(adminController.createProduct))

module.exports = adminRouter