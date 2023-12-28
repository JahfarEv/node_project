const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "pls enter the name"],
  },
  email: {
    type: String,
    required: [true, "pls enter the email"],
    lowercase: true,
    validate: [validator.isEmail, "pls enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "pls enter password"],
  },

  confrmPassword: {
    type: String,
    required: [true, "pls confirm your password"],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: 'password & confirm password does not match!'
    },
  },
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
this.password =await bcrypt.hash(this.password, 12);
this.confrmPassword = undefined;
next();
})



const user = mongoose.model("user", userSchema);

module.exports = user;
