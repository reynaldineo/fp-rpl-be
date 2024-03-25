import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import { AuthController } from "../controllers/auth.controller.js";

export class AuthRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public user = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //this.router.post(`${this.path}/sample/:number(\\d+)`, ValidationMiddleware(SampleTestDTO, true), this.user.SampleTest);
    // Define your routes here
  }
}
