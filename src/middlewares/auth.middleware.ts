import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException.js";
import { VerifyToken } from "../utils/jwt.js";
import { JwtPayload } from "jsonwebtoken";

/**
 * Get authorization token from either cookie or header
 * @param {Request} req - The request object
 * @returns Authorization Token
 */
const getAuthorization = (req: Request) => {
  const cookie = req.cookies["FP_Authorization"];
  if (cookie) return cookie;

  const header = req.header("Authorization");
  if (header) return header.split("Bearer ")[1];

  return null;
};

/**
 * Auth Middleware
 */
export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);
    console.log(Authorization);
    if (!Authorization) next(new HttpException(401, "Authorization header or cookie is missing"));

    const token = await VerifyToken(Authorization);
    if ((token as JwtPayload).id) {
      req.userId = (token as JwtPayload).id;
      console.log(req.userId);
      next();
    } else {
      next(new HttpException(401, "Wrong Authentication Tokens"));
    }
  } catch (error) {
    next(new HttpException(401, error));
  }
};
