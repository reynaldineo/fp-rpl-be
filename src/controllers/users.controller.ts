import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { UserService } from "../services/users.service.js";
import { HttpException } from "../exceptions/HttpException.js";
import { UpdateUserDTO } from "../dtos/users.dto.js";
import { responseSuccess } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";

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
        throw new HttpException(StatusCodes.BAD_REQUEST, "Can not find account details !");
      } else {
        responseSuccess(res, {
          status: StatusCodes.OK,
          message: "Success get account details",
          data: account,
        });
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
      responseSuccess(res, {
        status: StatusCodes.OK,
        message: "Success get role",
        data: {
          id: req.userId,
          role: role.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Update the specified account properties. Otherwise don't include it in the request body
   * @endpoint [Put] /user/update
   * @Body {UpdateUserDTO} - Request body
   */
  public UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props: UpdateUserDTO = req.body;
      const updatedData = await this.user.UpdateProperties(req.userId, props);

      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Success update account",
        data: updatedData,
      });
    } catch (error) {
      next(error);
    }
  };
}
