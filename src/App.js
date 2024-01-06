const express = require("express");
const authRouter = require("./Apis/router/authRouter");
const CustomError = require('./utils/customError')
const globalErrorHandler = require('./Apis/controllers/errorController');
const adminRouter = require("./Apis/Router/adminRouter");
const app = express();
app.use(express.json())
app.use("/api/users", authRouter);
app.use("/api/admin/",adminRouter)

app.all("*", (req, res, next) => {
  
const err = new CustomError(`Can't find ${req.originalUrl} on the server`,404)

    next(err);
});

app.use(globalErrorHandler)

module.exports = app;
