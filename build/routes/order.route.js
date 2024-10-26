"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const order_controller_1 = require("../controllers/order.controller");
const user_controller_1 = require("../controllers/user.controller");
const orderRouter = express_1.default.Router();
orderRouter.post("/create-order", user_controller_1.updateAccessToken, auth_1.isAutheticated, order_controller_1.createOrder);
orderRouter.get("/get-orders", user_controller_1.updateAccessToken, auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), order_controller_1.getAllorders);
exports.default = orderRouter;