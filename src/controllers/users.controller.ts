import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { UserService } from "../services/users.service.js";

export class UserController {
  public user = Container.get(UserService);

  public GetRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = await this.user.GetRoles(req.userId);
      res.status(200).json({ role: role.role });
    } catch (error) {
      next(error);
    }
  };
}
