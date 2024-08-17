"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserServices = exports.updateUserRoleServices = exports.getAllUsersService = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const redis_1 = require("../utils/redis");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
//get user by id
const getUserById = async (id, res) => {
    const userJson = await redis_1.redis.get(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(200).json({
            success: true,
            user,
        });
    }
};
exports.getUserById = getUserById;
//get all users
const getAllUsersService = async (res) => {
    const users = await user_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    });
};
exports.getAllUsersService = getAllUsersService;
//update user roles
const updateUserRoleServices = async (res, id, role) => {
    const user = await user_model_1.default.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
        success: true,
        user,
    });
};
exports.updateUserRoleServices = updateUserRoleServices;
//delete user
const deleteUserServices = async (id, res, next) => {
    const user = await user_model_1.default.findById(id);
    if (!user) {
        return next(new ErrorHandler_1.default("User not found", 404));
    }
    await user_model_1.default.findByIdAndDelete(id);
    await redis_1.redis.del(id);
    res.status(201).json({
        success: true,
        message: "User deleted Successfully",
    });
};
exports.deleteUserServices = deleteUserServices;
