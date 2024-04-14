import { Service } from "typedi";
import db from "../config/database.js";
import { actCourse, addComment } from "../interfaces/course.interface.js";
import { HttpException } from "../exceptions/HttpException.js";
import { commentInfo, courseDetail, courseInfo, courseProd } from "../types/course.type.js";

@Service()
export class CourseService {
  public getCourses = async (limit: number, offset: number) => {
    return await db.course.findMany({
      select: courseInfo,
      take: limit,
      skip: offset,
    });
  };

  public getCoursesByUsername = async (username: string, limit: number, offset: number) => {
    const account = await getAccountID(username);
    if (!account) {
      throw new HttpException(400, "There is no account with username: " + username);
    }
    return await db.course.findMany({
      where: {
        account_id: account.id,
      },
      select: courseInfo,
      take: limit,
      skip: offset,
    });
  };

  public getCourseByID = async (courseID: string) => {
    return await db.course.findUnique({
      select: courseDetail,
      where: {
        id: courseID,
      },
    });
  };

  public getCoursesByTitle = async (limit: number, offset: number, searchDat: string) => {
    return await db.course.findMany({
      where: {
        title: {
          contains: searchDat,
        },
      },
      select: courseInfo,
      take: limit,
      skip: offset,
    });
  };

  public getUsersLikeCourse = async (courseID: string) => {
    return await db.like.findMany({
      where: {
        course_id: courseID,
      },
      select: {
        account: {
          select: {
            username: true,
          },
        },
      },
    });
  };

  public getProdsByCourse = async (courseID: string) => {
    return await db.product.findMany({
      where: {
        course_id: courseID,
      },
      select: courseProd,
    });
  };

  public giveLikeUnlike = async (courseID: string, accountID: string) => {
    const check = await isLiked(courseID, accountID);
    console.log(check);
    return await db.$transaction([
      check
        ? db.like.delete({
            where: {
              id: check.id,
            },
            select: {
              id: true,
            },
          })
        : db.like.create({
            data: {
              course_id: courseID,
              account_id: accountID,
            },
            select: {
              id: true,
            },
          }),
      check
        ? db.course.update({
            where: {
              id: courseID,
            },
            data: {
              like_count: {
                decrement: 1,
              },
            },
            select: {
              like_count: true,
            },
          })
        : db.course.update({
            where: {
              id: courseID,
            },
            data: {
              like_count: {
                increment: 1,
              },
            },
            select: {
              like_count: true,
            },
          }),
    ]);
  };

  public createComment = async (attribute: addComment, accountID: string) => {
    return await db.comment.create({
      data: {
        course_id: attribute.courseID,
        account_id: accountID,
        comment: attribute.comment,
      },
      select: commentInfo,
    });
  };

  public createCourse = async (attribute: actCourse, accountID: string) => {
    return await db.course.create({
      data: {
        id: attribute.courseID,
        url: attribute.url,
        img_cover: attribute.img_cover,
        title: attribute.title,
        caption: attribute.caption,
        label: attribute.label,
        account_id: accountID,
      },
    });
  };

  public editCourse = async (attribute: actCourse, accountID: string) => {
    const check = await isOwned(attribute);
    if (!check) {
      throw new HttpException(400, "There is no course with ID: " + attribute.courseID);
    } else if (check && check.account_id !== accountID) {
      throw new HttpException(400, "You don't have permission to edit this course");
    }

    return await db.course.update({
      data: {
        title: attribute.title,
        caption: attribute.caption,
        label: attribute.label,
      },
      where: {
        id: attribute.courseID,
      },
      select: {
        id: true,
        title: true,
        caption: true,
        label: true,
      },
    });
  };

  public deleteCourse = async (attribute: actCourse, accountID: string) => {
    const check = await isOwned(attribute);
    if (!check) {
      throw new HttpException(400, "There is no course with ID: " + attribute.courseID);
    } else if (check && check.account_id !== accountID) {
      throw new HttpException(400, "You don't have permission to delete this course");
    }
    return await db.course.delete({
      where: {
        id: attribute.courseID,
      },
      select: {
        id: true,
        url: true,
        title: true,
      },
    });
  };
}

export const getAccountID = (uname: string) => {
  return db.account.findUnique({
    where: {
      username: uname,
    },
    select: {
      id: true,
    },
  });
};

export const isLiked = (courseID: string, accountID: string) => {
  return db.like.findFirst({
    where: {
      course_id: courseID,
      account_id: accountID,
    },
    select: {
      id: true,
    },
  });
};

export const isOwned = (attribute: actCourse) => {
  return db.course.findUnique({
    where: {
      id: attribute.courseID,
    },
    select: {
      account_id: true,
    },
  });
};
