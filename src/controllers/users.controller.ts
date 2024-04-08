import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { UserService } from "../services/users.service.js";
import { HttpException } from "../exceptions/HttpException.js";

export class UserController {
  public user = Container.get(UserService);

  /**
   * @description Get the details from currently logged in account
   * @endpoint [Get] /user/details
   * @return {AccountDetails} - Account details from the logged in account
   */
  public GetDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const account = await this.user.GetDetails(req.userId);

      if (!account) {
        throw new HttpException(400, "Can not find account details !");
      } else {
        res.status(200).json(account);
      }
      // eslint-disable-next-line prettier/prettier
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Get the roles of currently logged in account
   * @endpoint [Get] /user/getrole
   * @return {Id, Role} - Id and Role from the logged in account
   */
  public GetRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = await this.user.GetRoles(req.userId);
      res.status(200).json({ id: req.userId, role: role.role });
    } catch (error) {
      next(error);
    }
  };
}
