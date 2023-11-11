import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { getNotifications, updateNotification } from "../controllers/notification.controller";
const notificationsRoute = express.Router();


notificationsRoute.get("/get-all-notifications",isAutheticated ,authorizeRoles('admin'),getNotifications);  
notificationsRoute.put("/update-notification/:id",isAutheticated,authorizeRoles('admin'),updateNotification)

export default notificationsRoute;