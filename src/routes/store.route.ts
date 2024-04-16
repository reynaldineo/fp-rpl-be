import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import { StoreController } from "../controllers/store.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { updateCartDTO } from "../dtos/store.dto.js";

export class StoreRoute implements Routes {
  public path = "/store";
  public router = Router();
  public user = new StoreController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(
      `${this.path}/cart/:id/update`,
      AuthMiddleware,
      ValidationMiddleware(updateCartDTO, true, true),
      this.user.updateCart,
    );
    this.router.delete(`${this.path}/cart/:id/delete`, AuthMiddleware, this.user.delQtyProd);
  }
}
