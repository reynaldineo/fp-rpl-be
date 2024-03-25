import { Container } from "typedi";
import { CourseService } from "../services/course.service.js";

export class CourseController {
  public course = Container.get(CourseService);
  /*
    Define your function for the endpoint
  */
}
