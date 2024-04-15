import { Container } from "typedi";
import { NextFunction, Request, Response } from "express";
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto.js";
import { HttpException } from "../exceptions/HttpException.js";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/users.service.js";
import { Hash } from "../utils/Argon2id.js";
import { responseOK } from "../utils/response.js";

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
        throw new HttpException(400, "Email already been used");
      }

      const account = await this.auth.addAccount({
        email: register.email,
        password: await Hash(register.password),
        created_at: new Date(),
      });

      res.status(200).json({ message: "success", id: account.id });
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

      responseOK(res, "Success login", { id: data.id, role: data.role, jwt: data.jwt });
    } catch (error) {
      next(error);
    }
  };
}
