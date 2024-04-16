/* eslint-disable */
import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { StoreService } from "../services/store.service.js";
import { responseSuccess } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";
import { updateCartDTO } from "../dtos/store.dto.js";

export class StoreController {
  public store = Container.get(StoreService);

  public updateCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const prodID: string = req.params.id;
      const { qty }: updateCartDTO = req.body;
      const data = await this.store.updateCart(req.userId, prodID, qty);
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Cart is updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public delQtyProd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const prodID: string = req.params.id;
      const data = await this.store.updateCart(req.userId, prodID, 0, true);
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Product is deleted from cart",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
