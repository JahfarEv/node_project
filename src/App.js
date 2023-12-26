const express = require("express");
const app = express();
const authRouter = require("./Apis/Router/authRouter");

app.use("/api/users", authRouter);
app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status:'fail',
    //     message: `Can't find ${req.originalUrl} on the server`
    // })
    const err = new Error(`Can't find ${req.originalUrl} on the server`);
    err.status = 'fail',
    err.statusCode = 404;

    next(err);
});

app.use((error,req,res,next)=>{
    error.statusCode = error.statusCode ||500;
    error.status = error.status || 'error'
    res.status(error.statusCode).json({
        status: error.statusCode,
        message:error.message
    })
})

module.exports = app;
