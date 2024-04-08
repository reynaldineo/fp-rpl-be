import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import { StoreController } from "../controllers/store.controller.js";

export class StoreRoute implements Routes {
  public path = "/store";
  public router = Router();
  public user = new StoreController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}/cart/:id/update`, this.user.updateCart);
    this.router.delete(`${this.path}/cart/:id/delete`, this.user.delQtyProd);
  }
}
