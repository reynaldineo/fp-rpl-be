import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import { CourseController } from "../controllers/course.controller.js";

export class CourseRoute implements Routes {
  public path = "/course";
  public router = Router();
  public user = new CourseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //this.router.post(`${this.path}/sample/:number(\\d+)`, ValidationMiddleware(SampleTestDTO, true), this.user.SampleTest);
    // Define your routes here
  }
}
