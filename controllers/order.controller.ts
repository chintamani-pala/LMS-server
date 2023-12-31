import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import userModel from "../models/user.model";
import orderModel,{IOrder} from "../models/orderModel";
import path from "path";
// import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notificationModel";
import { getAllordersService, newOrder } from "../services/order.services";

//create order
export const createOrder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const {courseId,payment_info} = req.body as IOrder;
            const user=await userModel.findById(req.user?._id);
            const courseExistInUser = user?.courses.some((course:any)=>course._id.toString()===courseId)
            if(courseExistInUser){
                return next(new ErrorHandler("You have already purchased this Course", 404));
            }
            const course = await CourseModel.findById(courseId);
            if(!course){
                return next(new ErrorHandler("Course not found", 404));
            }
            const data:any={
                courseId:course._id,
                userId:user?._id,
                payment_info
            };

            

            const mailData = {
                order: {
                    _id: course._id.toString().slice(0,6),
                    userName: user?.name,
                    name: course.name,
                    price: course.price,
                    userEmail:user?.email,
                    date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})
                }
            }

            // const html = await ejs.renderFile(path.join(__dirname,'../mails/order-confirmation.ejs'),{order:mailData});

            // try{
            //     if(user){
            //         await sendMail({
            //             email: user.email,
            //             subject: "Order Confirmation",
            //             template: "order-confirmation.ejs",
            //             data:mailData,
            //         });
            //     }
            // }catch(error:any){
            //     return next(new ErrorHandler(error.message,500));
            // }

            user?.courses.push(course?._id);
            await user?.save();
            
            await NotificationModel.create({
                user: user?._id,
                title: "New Order",
                message: `You have a new order from ${course?.name}`,
            });

            if(course.purchased){
                course.purchased+=1;
            }
            await course.save();
            newOrder(data,res,next);
            
        }catch(error:any){
            return next(new ErrorHandler(error.message, 500));
        }
    }
);



//get all orders --only for admin
export const getAllorders = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        getAllordersService(res);
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );
