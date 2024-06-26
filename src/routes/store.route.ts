import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import { StoreController } from "../controllers/store.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { invoiceDTO, updateCartDTO, updateProdDTO } from "../dtos/store.dto.js";
import { upload } from "../config/index.js";

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
      upload.fields([{ name: "product_img", maxCount: 1 }]),
      this.user.createProd,
    );
    this.router.put(
      `${this.path}/update/:id`,
      AuthMiddleware,
      ValidationMiddleware(updateProdDTO, true, true),
      this.user.updateProd,
    );
    this.router.get(`${this.path}/cart`, AuthMiddleware, this.user.getCart);
    this.router.delete(`${this.path}/delete/:id`, AuthMiddleware, this.user.delProd);
    this.router.put(
      `${this.path}/cart/:id/update`,
      AuthMiddleware,
      ValidationMiddleware(updateCartDTO, true, true),
      this.user.updateCart,
    );
    this.router.post(`${this.path}/cart/purchase`, AuthMiddleware, this.user.purchaseFromCart);
    this.router.delete(`${this.path}/cart/:id/delete`, AuthMiddleware, this.user.delQtyProd);
    this.router.get(`${this.path}/invoice`, AuthMiddleware, this.user.getInvoices);
    this.router.get(`${this.path}/invoice/:id`, AuthMiddleware, this.user.getInvoiceByID);
    this.router.post(
      `${this.path}/invoice/create`,
      AuthMiddleware,
      ValidationMiddleware(invoiceDTO, true, true),
      this.user.createInvoice,
    );
    this.router.put(
      `${this.path}/invoice/:id/update`,
      AuthMiddleware,
      ValidationMiddleware(invoiceDTO, true, true),
      this.user.editInvoice,
    );
    this.router.delete(`${this.path}/invoice/:id/delete`, AuthMiddleware, this.user.delInvoice);
  }
}
