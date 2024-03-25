import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { UserService } from "../services/users.service.js";
import { SampleTestDTO } from "../dtos/users.dto.js";

export class UserController {
  public user = Container.get(UserService);

  // Just a sample . Delete it if you need to modify this file
  public SampleTest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const number = Number(req.params.number);
      const data: SampleTestDTO = req.body;

      res.status(200).json({ str: data.str, temp: data.temperature, number });
    } catch (error) {
      next(error);
    }
  };
}
