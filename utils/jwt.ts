require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}
//environ variable to integrate with fallback value
export const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);
export const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

//option for cookie
export const accessTokenOption: ITokenOptions = {
  expires: new Date(Date.now() - accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

export const refreshTokenOption: ITokenOptions = {
  expires: new Date(Date.now() - refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

export const sendToken = async (user: IUser,statusCode:any, res: Response) => {
  const accessToken = await user.SignAccessToken();
  const refreshToken = await user.SignRefreshToken();

  //upload session in redis
  redis.set(user._id,JSON.stringify(user) as any)
  
  //only set secure to true in production
  if (process.env.MODE_ENV == "production") {
    accessTokenOption.secure = true;
    refreshTokenOption.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOption);
  res.cookie("refresh_token", refreshToken, refreshTokenOption);
  //status code need to change later
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
