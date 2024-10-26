import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { createOrder, getAllorders } from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter = express.Router();

orderRouter.post(
  "/create-order",
  updateAccessToken,
  isAutheticated,
  createOrder
);
orderRouter.get(
  "/get-orders",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  getAllorders
);

export default orderRouter;
