const express = require("express");
const authRouter = require("./Apis/Router/authRouter");
const CustomError = require('./Utils/customError')
const globalErrorHandler = require('./Apis/controllers/errorController')
const app = express();
app.use(express.json())
app.use("/api/users", authRouter);
app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status:'fail',
    //     message: `Can't find ${req.originalUrl} on the server`
    // })
//     const err = new Error(`Can't find ${req.originalUrl} on the server`);
//     err.status = 'fail',
//     err.statusCode = 404;
const err = new CustomError(`Can't find ${req.originalUrl} on the server`,404)

    next(err);
});

app.use(globalErrorHandler)

module.exports = app;
