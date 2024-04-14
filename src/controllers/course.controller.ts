import { Container } from "typedi";
import { CourseService } from "../services/course.service.js";
import { responseOK } from "../utils/response.js";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException.js";
import { actCourse } from "../interfaces/course.interface.js";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

export class CourseController {
  public course = Container.get(CourseService);

  public getCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data: any;
      if (req.query.search !== undefined) {
        data = await this.course.getCoursesByTitle(
          Number(req.query.limit),
          Number(req.query.offset),
          req.query.search as string,
        );
      } else {
        data = await this.course.getCourses(Number(req.query.limit), Number(req.query.offset));
      }
      if (data.length === 0) {
        throw new HttpException(400, "Course is currently empty");
      }
      responseOK(res, "Courses are retrieved successfully", data);
    } catch (error) {
      next(error);
    }
  };

  public getByUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.course.getCoursesByUsername(
        req.params.username,
        Number(req.query.limit),
        Number(req.query.offset),
      );
      if (data.length === 0) {
        throw new HttpException(400, "There is no course in this account");
      } else {
        responseOK(res, "Success get course by username", data);
      }
    } catch (error) {
      next(error);
    }
  };

  public getByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.course.getCourseByID(req.params.id);
      if (!data) {
        throw new HttpException(400, "There is no course with ID: " + req.params.id);
      } else {
        responseOK(res, "Success get course detail", data);
      }
    } catch (error) {
      next(error);
    }
  };

  public getUserLikesCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.course.getUsersLikeCourse(req.params.id);
      if (!data) {
        throw new HttpException(400, "Course not found");
      } else if (data.length === 0) {
        responseOK(res, "No one likes this course");
      } else {
        responseOK(res, "Success get user who likes the course", data);
      }
    } catch (error) {
      next(error);
    }
  };

  public getCourseProd = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.course.getProdsByCourse(req.params.id);
      if (!data) {
        throw new HttpException(400, "Course not found");
      } else if (data.length === 0) {
        responseOK(res, "No product in this course");
      } else {
        responseOK(res, "Success get product from course", data);
      }
    } catch (error) {
      next(error);
    }
  };

  public addCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const { title, caption, label }: actCourse = req.body;
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
      responseOK(res, "Course is created successfully", data);
    } catch (error) {
      next(error);
    }
  };

  public tapLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.course.giveLikeUnlike(req.params.id, req.userId);
      responseOK(res, "Course is liked or unliked successfully", data);
    } catch (error) {
      next(error);
    }
  };

  public addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment }: { comment: string } = req.body;
      const data = await this.course.createComment({ courseID: req.params.id, comment }, req.userId);
      responseOK(res, "Comment is created successfully", data);
    } catch (error) {
      next(error);
    }
  };

  public editCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, label, caption }: actCourse = req.body;
      const data = await this.course.editCourse({ title, label, caption, courseID: req.params.id }, req.userId);
      responseOK(res, "Course is updated successfully", data);
    } catch (error) {
      next(error);
    }
  };

  public deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.course.deleteCourse({ courseID: req.params.id }, req.userId);
      await cloudinary.api.delete_resources(["course/vid/" + data.id, "course/img_cover/" + data.id]);
      responseOK(res, "Course is deleted successfully", data);
    } catch (error) {
      next(error);
    }
  };
}