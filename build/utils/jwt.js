"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOption = exports.accessTokenOption = exports.refreshTokenExpire = exports.accessTokenExpire = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
//environ variable to integrate with fallback value
exports.accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
exports.refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
//option for cookie
exports.accessTokenOption = {
    expires: new Date(Date.now() - exports.accessTokenExpire * 60 * 60 * 1000),
    maxAge: exports.accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
exports.refreshTokenOption = {
    expires: new Date(Date.now() - exports.refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: exports.accessTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
const sendToken = async (user, statusCode, res) => {
    const accessToken = await user.SignAccessToken();
    const refreshToken = await user.SignRefreshToken();
    //upload session in redis
    redis_1.redis.set(user._id, JSON.stringify(user));
    //only set secure to true in production
    if (process.env.MODE_ENV == "production") {
        exports.accessTokenOption.secure = true;
        exports.refreshTokenOption.secure = true;
    }
    res.cookie("access_token", accessToken, exports.accessTokenOption);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOption);
    //status code need to change later
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
exports.sendToken = sendToken;
