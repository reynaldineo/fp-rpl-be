import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { Routes } from "../interfaces/routes.interface.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { UpdateUserDTO } from "../dtos/users.dto.js";

export class UserRoute implements Routes {
  public path = "/user";
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Define your routes heres
    this.router.get(`${this.path}/details`, AuthMiddleware, this.user.GetDetail);
    this.router.put(
      `${this.path}/update`,
      AuthMiddleware,
      ValidationMiddleware(UpdateUserDTO, true, true),
      this.user.UpdateUser,
    );
  }
}
