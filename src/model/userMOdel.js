const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
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
    select: false,
  },

  confrmPassword: {
    type: String,
    required: [true, "pls confirm your password"],
    select: false,
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "password & confirm password does not match!",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confrmPassword = undefined;
  next();
});

userSchema.methods.comparePasswordInDb = async function (pswd, pswdDB) {
  return await bcrypt.compare(pswd,pswdDB);
};

const user = mongoose.model("user", userSchema);

module.exports = user;
