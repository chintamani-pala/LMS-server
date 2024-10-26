import express from "express";
import {
  addAnswer,
  addQuestion,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAdminAllcourses,
  getAllCourse,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  uploadCourse
);
courseRouter.put(
  "/edit-course/:id",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  editCourse
);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourse);
courseRouter.get(
  "/get-course-content/:id",
  updateAccessToken,
  isAutheticated,
  getCourseByUser
);
courseRouter.put(
  "/add-question",
  updateAccessToken,
  isAutheticated,
  addQuestion
);
courseRouter.put("/add-answer", updateAccessToken, isAutheticated, addAnswer);
courseRouter.put(
  "/add-review/:id",
  updateAccessToken,
  isAutheticated,
  addReview
);
// courseRouter.put("/add-reply", isAutheticated, authorizeRoles("admin"),addReplyToReview);
courseRouter.get(
  "/get-admin-courses",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  getAdminAllcourses
);
courseRouter.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  deleteCourse
);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

export default courseRouter;
