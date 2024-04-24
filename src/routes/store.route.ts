import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import { StoreController } from "../controllers/store.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { addProdDTO, updateCartDTO } from "../dtos/store.dto.js";

export class StoreRoute implements Routes {
  public path = "/store";
  public router = Router();
  public user = new StoreController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.user.getProds);
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.user.getByID);
    this.router.post(
      `${this.path}/create`,
      AuthMiddleware,
      ValidationMiddleware(addProdDTO, true, true),
      this.user.createProd,
    );
    this.router.put(
      `${this.path}/update/:id`,
      AuthMiddleware,
      ValidationMiddleware(addProdDTO, true, true),
      this.user.updateProd,
    );
    this.router.delete(`${this.path}/delete/:id`, AuthMiddleware, this.user.delProd);
    this.router.get(`${this.path}/cart`, AuthMiddleware, this.user.getCart);
    this.router.put(
      `${this.path}/cart/:id/update`,
      AuthMiddleware,
      ValidationMiddleware(updateCartDTO, true, true),
      this.user.updateCart,
    );
    this.router.delete(`${this.path}/cart/:id/delete`, AuthMiddleware, this.user.delQtyProd);
  }
}
