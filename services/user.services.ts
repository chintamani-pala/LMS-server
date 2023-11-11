import { NextFunction, Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";

//get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(200).json({
      success: true,
      user,
    });
  }
};

//get all users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    users,
  });
};

//update user roles
export const updateUserRoleServices = async(res:Response,id:string,role:string) => {
  const user = await userModel.findByIdAndUpdate(id,{role},{new:true});
  res.status(201).json({
    success:true,
    user,
  })
}

//delete user
export const deleteUserServices = async (id: string, res: Response, next: NextFunction) => {
  const user = await userModel.findById(id);
  if(!user){
    return next(new ErrorHandler("User not found", 404));
  }
  await userModel.findByIdAndDelete(id);
  await redis.del(id);
  res.status(201).json({
    success: true,
    message:"User deleted Successfully",
  });
}
