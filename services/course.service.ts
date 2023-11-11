import { NextFunction, Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";

//create course
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);

//get all courses
export const getAllcoursesService = async (res: Response) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    courses,
  });
};

//delete course --only for admin
export const deleteCourseServices = async (id: string, res: Response, next: NextFunction) => {
  const user = await CourseModel.findById(id);
  if(!user){
    return next(new ErrorHandler("Course not found", 404));
  }
  await CourseModel.findByIdAndDelete(id);
  await redis.del(id);
  res.status(201).json({
    success: true,
    message:"Course deleted Successfully",
  });
}