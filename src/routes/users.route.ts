import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { Routes } from "../interfaces/routes.interface.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

export class UserRoute implements Routes {
  public path = "/user";
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Define your routes heres
    this.router.get(`${this.path}/getrole`, AuthMiddleware, this.user.GetRole);
  }
}
