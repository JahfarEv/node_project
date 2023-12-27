const user = require("../../model/userMOdel");
const asyncErrorHandler = require('../../Utils/asyncErrorHandler')

exports.signup =asyncErrorHandler (async (req, res, next) => {
   
   const newUser= await user.create(req.body);
   res.status(201).json({
      status:'sucess',
      data: {
         user: newUser
      }
   })

})
//.module.exports = signup;


