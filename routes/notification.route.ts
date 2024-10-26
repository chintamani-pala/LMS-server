import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";
import { updateAccessToken } from "../controllers/user.controller";
const notificationsRoute = express.Router();

notificationsRoute.get(
  "/get-all-notifications",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  getNotifications
);
notificationsRoute.put(
  "/update-notification/:id",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  updateNotification
);

export default notificationsRoute;
