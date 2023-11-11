import express from 'express';
import { authorizeRoles, isAutheticated } from '../middleware/auth';
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from '../controllers/analytics.controller';
const analyticsRouter = express.Router();


//get user analytics --only for admin
analyticsRouter.get('/get-user-analytics', isAutheticated,authorizeRoles('admin'),getUserAnalytics);
analyticsRouter.get('/get-orders-analytics', isAutheticated,authorizeRoles('admin'),getOrderAnalytics);
analyticsRouter.get('/get-courses-analytics', isAutheticated,authorizeRoles('admin'),getCourseAnalytics);


export default analyticsRouter;