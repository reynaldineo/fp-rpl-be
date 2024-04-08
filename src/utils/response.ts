/* eslint-disable */
import { Response } from "express";

export const responseOK = (res: Response, message: string, data: any) => {
  return res.status(200).json({
    success: true,
    message: message,
    data: data,
  });
};
