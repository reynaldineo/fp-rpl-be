import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { SampleTestDTO } from "../dtos/users.dto.js";
import { Routes } from "../interfaces/routes.interface.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";

export class UserRoute implements Routes {
  public path = "/user";
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/sample/:number(\\d+)`, ValidationMiddleware(SampleTestDTO, true), this.user.SampleTest);
    // Define your routes here
  }
}
