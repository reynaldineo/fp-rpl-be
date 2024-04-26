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
   * @description Update the specified account properties. Otherwise don't include it in the request body
   * @endpoint [Put] /user/update
   * @Body {UpdateUserDTO} - Request body
   */
  public UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props: UpdateUserDTO = req.body;
      if (await this.user.CheckUserByEmail(props.email)) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "Email already been used");
      }

      if (await this.user.CheckUserByUsername(props.username)) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "Username already been used");
      }

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
