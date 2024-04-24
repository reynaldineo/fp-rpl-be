import { Response } from "express";
import { responseAPI } from "../interfaces/response.interface.js";

export const responseSuccess = (res: Response, response: responseAPI) => {
  return res.status(response.status).json({
    success: true,
    message: response.message,
    data: response.data,
    pageNumber: response.pageNumber,
    pageSize: response.pageSize,
    maxPage: response.maxPage,
  });
};
