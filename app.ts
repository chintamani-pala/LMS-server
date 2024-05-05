import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/couse.route";
import orderRouter from "./routes/order.route";
import notificationsRoute from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
require("dotenv").config();
import { rateLimit } from 'express-rate-limit'


//body parser
app.use(express.json({ limit: "50mb" }));
//cookie parse
app.use(cookieParser());
//cors=>cross origin resource sharing
app.use(
  cors({
    origin: "*", 
    credentials: true,
  }),
  
);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})



app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationsRoute);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

//post request test
app.post("/posttest", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Post API is working",
  });
});

//unknown route
app.all("/*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not fount`) as any;
  err.statusCode = 404;
  next(err);
});


// Apply the rate limiting middleware to all requests.
app.use(limiter)
app.use(ErrorMiddleware);
