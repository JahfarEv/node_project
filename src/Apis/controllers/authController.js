const user = require("../../model/userMOdel");

exports.signup = async (req, res, next) => {
   const newUser= await user.create(req.body)
};
