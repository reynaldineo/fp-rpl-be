import { Router } from "express";
import { StoreController } from "../controllers/store.controller.js";
import { Routes } from "../interfaces/routes.interface.js";

export class StoreRoute implements Routes {
  public path = "/store";
  public router = Router();
  public user = new StoreController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //this.router.post(`${this.path}/sample/:number(\\d+)`, ValidationMiddleware(SampleTestDTO, true), this.user.SampleTest);
    // Define your routes here
  }
}
