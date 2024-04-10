import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import { CourseController } from "../controllers/course.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

export class CourseRoute implements Routes {
  public path = "/course";
  public router = Router();
  public user = new CourseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.user.getCourse);
    this.router.get(`${this.path}/:username`, AuthMiddleware, this.user.myCourse);
    this.router.get(`${this.path}/detail/:id`, AuthMiddleware, this.user.getCourseByID);
    this.router.get(`${this.path}/detail/:id/getLikes`, AuthMiddleware, this.user.getUserLikesCourse);
    this.router.get(`${this.path}/detail/:id/productList`, AuthMiddleware, this.user.getCourseProd);
    this.router.post(`${this.path}/create`, AuthMiddleware, this.user.addCourse);
    this.router.post(`${this.path}/detail/:id/doLike`, AuthMiddleware, this.user.tapLike); // like or unlike
    this.router.post(`${this.path}/detail/:id/doComment`, AuthMiddleware, this.user.addComment);
    this.router.put(`${this.path}/detail/:id/edit`, AuthMiddleware, this.user.editCourse);
    this.router.delete(`${this.path}/detail/:id/delete`, AuthMiddleware, this.user.deleteCourse);
  }
}
