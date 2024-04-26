import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import { CourseController } from "../controllers/course.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../config/index.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { courseInputDTO } from "../dtos/course.dto.js";

export class CourseRoute implements Routes {
  public path = "/course";
  public router = Router();
  public user = new CourseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.user.getCourse);
    this.router.post(
      `${this.path}/create`,
      AuthMiddleware,
      upload.fields([
        { name: "vid", maxCount: 1 },
        { name: "img_cover", maxCount: 1 },
      ]),
      ValidationMiddleware(courseInputDTO, true, true),
      this.user.addCourse,
    );
    this.router.get(`${this.path}/:username`, AuthMiddleware, this.user.getByUsername);
    this.router.get(`${this.path}/:id/detail`, AuthMiddleware, this.user.getByID);
    this.router.get(`${this.path}/:id/getLikes`, AuthMiddleware, this.user.getUserLikesCourse);
    this.router.get(`${this.path}/:id/product`, AuthMiddleware, this.user.getCourseProd);
    this.router.post(`${this.path}/:id/tapLike`, AuthMiddleware, this.user.tapLike); // like or unlike
    this.router.post(`${this.path}/:id/addComment`, AuthMiddleware, this.user.addComment);
    this.router.put(
      `${this.path}/:id/update`,
      AuthMiddleware,
      ValidationMiddleware(courseInputDTO, true, true),
      this.user.editCourse,
    );
    this.router.delete(`${this.path}/:id/delete`, AuthMiddleware, this.user.deleteCourse);
  }
}
