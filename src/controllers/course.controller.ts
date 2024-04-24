import { Container } from "typedi";
import { CourseService } from "../services/course.service.js";
import { responseSuccess } from "../utils/response.js";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException.js";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import { addCommentDTO, courseInputDTO } from "../dtos/course.dto.js";
import { StatusCodes } from "http-status-codes";

export class CourseController {
  public course = Container.get(CourseService);

  public getCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { size, page, search, label } = req.query;

      const data = await this.course.getCourses(Number(size), Number(page), search as string, label as string);
      if (data.query.length === 0) {
        responseSuccess(res, {
          status: StatusCodes.NO_CONTENT,
          message: "There is no course in this account",
        });
      }
      responseSuccess(res, {
        status: StatusCodes.OK,
        message: "Courses are retrieved successfully",
        data: data.query,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        maxPage: data.maxPage,
      });
    } catch (error) {
      next(error);
    }
  };

  public getByUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.course.getCoursesByUsername(req.params.username);
      if (data.length === 0) {
        responseSuccess(res, {
          status: StatusCodes.NO_CONTENT,
          message: "There is no course in this account",
        });
      } else {
        responseSuccess(res, {
          status: StatusCodes.OK,
          message: "Courses by username are retrieved successfully",
          data,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public getByID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.course.getCourseByID(req.params.id);
      if (!data) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "There is no course with ID: " + req.params.id);
      } else {
        responseSuccess(res, {
          status: StatusCodes.OK,
          message: "Course by ID is retrieved successfully",
          data,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public getUserLikesCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.course.getUsersLikeCourse(req.params.id);
      if (!data) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "Course not found");
      } else if (data.length === 0) {
        responseSuccess(res, {
          status: StatusCodes.NO_CONTENT,
          message: "There is no user who likes this course",
        });
      } else {
        responseSuccess(res, {
          status: StatusCodes.OK,
          message: "Users who likes this course are retrieved successfully",
          data,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public getCourseProd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.course.getProdsByCourse(req.params.id);
      if (!data) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "Course not found");
      } else if (data.length === 0) {
        responseSuccess(res, {
          status: StatusCodes.NO_CONTENT,
          message: "There is no product in this course",
          data,
        });
      } else {
        responseSuccess(res, {
          status: StatusCodes.OK,
          message: "Products in this course are retrieved successfully",
          data,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public addCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const { title, caption, label }: courseInputDTO = req.body;
      const id = randomUUID();
      const { secure_url: url }: { secure_url: string } = await cloudinary.uploader.upload(files.vid[0].path, {
        resource_type: "video",
        folder: "course/vid",
        public_id: id,
      });
      const { secure_url: img_cover }: { secure_url: string } = await cloudinary.uploader.upload(
        files.img_cover[0].path,
        {
          resource_type: "image",
          folder: "course/img_cover",
          public_id: id,
        },
      );
      const data = await this.course.createCourse(
        {
          courseID: id,
          url,
          img_cover,
          title,
          caption,
          label,
        },
        req.userId,
      );
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Course is created successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public tapLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.course.giveLikeUnlike(req.params.id, req.userId);
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Course is liked or unliked successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { comment }: addCommentDTO = req.body;
      const data = await this.course.createComment({ courseID: req.params.id, comment }, req.userId);
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Comment is created successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public editCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, label, caption }: courseInputDTO = req.body;
      const data = await this.course.editCourse({ title, label, caption, courseID: req.params.id }, req.userId);
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Course is updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.course.deleteCourse({ courseID: req.params.id }, req.userId);
      await cloudinary.api.delete_resources(["course/vid/" + data.id, "course/img_cover/" + data.id]);
      responseSuccess(res, {
        status: StatusCodes.CREATED,
        message: "Course is deleted successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
