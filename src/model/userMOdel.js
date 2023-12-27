const mongoose = require("mongoose");
const validator = require("validator");
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

userSchema.pre('save', function(next){
    if(!this.isModified('password')) return next()
})



const user = mongoose.model("user", userSchema);

module.exports = user;
