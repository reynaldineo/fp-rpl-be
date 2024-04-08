/* eslint-disable */
import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { StoreService } from "../services/store.service.js";
import { responseOK } from "../utils/response.js";

export class StoreController {
  public store = Container.get(StoreService);

  public updateCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const prodID: string = req.params.id;
      const qty: number = req.body;
      const data = await this.store.updateCart(req.userId, prodID, qty);
      responseOK(res, "Cart telah diperbarui", data);
    } catch (error) {
      next(error);
    }
  };

  public delQtyProd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const prodID: string = req.params.id;
      const data = await this.store.updateCart(req.userId, prodID, 0, true);
      responseOK(res, "Produk telah dihapus dari cart", data);
    } catch (error) {
      next(error);
    }
  };
}
