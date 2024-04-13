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
    this.router.get(`${this.path}/:username`, AuthMiddleware, this.user.getByUsername);
    this.router.get(`${this.path}/:id/detail`, AuthMiddleware, this.user.getByID);
    this.router.get(`${this.path}/:id/getLikes`, AuthMiddleware, this.user.getUserLikesCourse);
    this.router.get(`${this.path}/:id/product`, AuthMiddleware, this.user.getCourseProd);
    this.router.post(`${this.path}/create`, AuthMiddleware, this.user.addCourse);
    this.router.post(`${this.path}/:id/tapLike`, AuthMiddleware, this.user.tapLike); // like or unlike
    this.router.post(`${this.path}/:id/addComment`, AuthMiddleware, this.user.addComment);
    this.router.put(`${this.path}/:id/update`, AuthMiddleware, this.user.editCourse);
    this.router.delete(`${this.path}/:id/delete`, AuthMiddleware, this.user.deleteCourse);
  }
}
