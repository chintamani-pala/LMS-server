"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourseServices = exports.getAllcoursesService = exports.createCourse = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const redis_1 = require("../utils/redis");
//create course
exports.createCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (data, res) => {
    const course = await course_model_1.default.create(data);
    res.status(201).json({
        success: true,
        course,
    });
});
//get all courses
const getAllcoursesService = async (res) => {
    const courses = await course_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        courses,
    });
};
exports.getAllcoursesService = getAllcoursesService;
//delete course --only for admin
const deleteCourseServices = async (id, res, next) => {
    const user = await course_model_1.default.findById(id);
    if (!user) {
        return next(new ErrorHandler_1.default("Course not found", 404));
    }
    await course_model_1.default.findByIdAndDelete(id);
    await redis_1.redis.del(id);
    res.status(201).json({
        success: true,
        message: "Course deleted Successfully",
    });
};
exports.deleteCourseServices = deleteCourseServices;
