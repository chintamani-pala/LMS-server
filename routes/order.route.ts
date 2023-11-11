import express from 'express';
import { authorizeRoles, isAutheticated } from '../middleware/auth';
import { createOrder, getAllorders } from '../controllers/order.controller';

const orderRouter = express.Router();

orderRouter.post("/create-order",isAutheticated,createOrder)
orderRouter.get("/get-orders",isAutheticated,authorizeRoles("admin"),getAllorders)

export default orderRouter;