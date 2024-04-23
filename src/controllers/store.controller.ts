import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { StoreService } from "../services/store.service.js";
import { responseSuccess } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";
import { updateCartDTO } from "../dtos/store.dto.js";
import { HttpException } from "../exceptions/HttpException.js";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

export class StoreController {
  public store = Container.get(StoreService);

  public getProds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.store.getProds();
      if (data.length === 0) {
        responseSuccess(res, {
          status: StatusCodes.NO_CONTENT,
          message: "There is no product in the store",
        });
      }
      responseSuccess(res, {
        status: StatusCodes.OK,
        message: "Products are retrieved successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProdDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.store.getProdDetail(req.params.id);
      if (!data) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "There is no product with id: " + req.params.id);
      }
      responseSuccess(res, {
        status: StatusCodes.OK,
        message: "Product is retrieved successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public createProd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const { name, price, stock, description } = req.body;
      const { secure_url: img_url }: { secure_url: string } = await cloudinary.uploader.upload(files.img[0].path, {
        resource_type: "image",
        folder: "product",
        public_id: randomUUID(),
      });
      const data = await this.store.addProd({ img_url, name, price, stock, description }, req.userId);
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Product is created successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, price, stock, description } = req.body;
      const data = await this.store.updateProd({ name, price, stock, description }, req.params.id, req.userId);
      if (!data) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "There is no product with id: " + req.params.id);
      }
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Product is updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public delProd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.store.deleteProd(req.params.id, req.userId);
      if (!data) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "There is no product with id: " + req.params.id);
      }
      await cloudinary.uploader.destroy(data.id, { resource_type: "image" });
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Product is deleted successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.store.getCartDetail(req.userId);
      if (data.length === 0) {
        responseSuccess(res, {
          status: StatusCodes.NO_CONTENT,
          message: "Cart is empty",
        });
      }
      responseSuccess(res, {
        status: StatusCodes.OK,
        message: "Cart is retrieved successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

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
      const data = await this.store.updateCart(req.userId, prodID, 0);
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
