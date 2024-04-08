import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import { AuthController } from "../controllers/auth.controller.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto.js";

export class AuthRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, ValidationMiddleware(RegisterDTO, false, true), this.auth.Register);
    this.router.post(`${this.path}/login`, ValidationMiddleware(LoginDTO, false, true), this.auth.Login);
  }
}
