import { Container } from "typedi";
import { NextFunction, Request, Response } from "express";
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto.js";
import { HttpException } from "../exceptions/HttpException.js";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/users.service.js";
import { Hash } from "../utils/Argon2id.js";
import { responseSuccess } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";

export class AuthController {
  public user = Container.get(UserService);
  public auth = Container.get(AuthService);

  /**
   * @description Register a new account
   * @endpoint [Post] /auth/register
   * @Body {RegisterDTO} - The request body
   */
  public Register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const register: RegisterDTO = req.body;

      if (await this.user.CheckUserByEmail(register.email)) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "Email already been used");
      }

      if (await this.user.CheckUserByUsername(register.username)) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "Username already been used");
      }

      const account = await this.auth.addAccount({
        email: register.email,
        username: register.username,
        password: await Hash(register.password),
      });
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Success register",
        data: account,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Login to an existing account
   * @endpoint [Post] /auth/login
   * @Body {LoginDTO} - The request body
   */
  public Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const login: LoginDTO = req.body;
      const data = await this.auth.login(login);
      const cookie = this.auth.CreateCookie(data.jwt);

      res.setHeader("Set-Cookie", [cookie]);

      responseSuccess(res, {
        status: StatusCodes.OK,
        message: "Success login",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
