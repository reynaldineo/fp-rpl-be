import { Service } from "typedi";
import db from "../config/database.js";
import { actCourse, addComment } from "../interfaces/course.interface.js";
import { HttpException } from "../exceptions/HttpException.js";
import { commentInfo, courseDetail, courseInfo, courseInfoByUsername, courseProd } from "../types/course.type.js";

@Service()
export class CourseService {
  public getCourses = async () => {
    return await db.course.findMany({
      select: courseInfo,
    });
  };

  public getCoursesByUsername = async (username: string) => {
    const account = await getAccountID(username);
    if (!account) {
      throw new HttpException(400, "There is no account with username: " + username);
    }
    return await db.course.findMany({
      where: {
        account_id: account.id,
      },
      select: courseInfoByUsername,
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

  public getUsersLikeCourse = async (courseID: string) => {
    return await db.like.findMany({
      where: {
        course_id: courseID,
      },
      select: {
        account: {
          select: {
            email: true,
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

  public giveLikeUnlike = async (attribute: actCourse, accountID: string) => {
    const check = await isLiked(attribute, accountID);
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
              course_id: attribute.courseID,
              account_id: accountID,
            },
            select: {
              id: true,
            },
          }),
      check
        ? db.course.update({
            where: {
              id: attribute.courseID,
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
              id: attribute.courseID,
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
        url: attribute.url,
        title: attribute.title,
        caption: attribute.caption,
        account_id: accountID,
      },
      select: {
        id: true,
      },
    });
  };

  public editCourse = async (attribute: actCourse, accountID: string) => {
    const check = await isOwned(attribute, accountID);
    if (!check) {
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
    const check = await isOwned(attribute, accountID);
    if (!check) {
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

export const getAccountID = (uname?: string, email?: string) => {
  if (uname) {
    return db.account.findFirst({
      where: {
        username: uname,
      },
      select: {
        id: true,
      },
    });
  } else {
    return db.account.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
  }
};

export const isLiked = (attribute: actCourse, accountID: string) => {
  return db.like.findFirst({
    where: {
      course_id: attribute.courseID,
      account_id: accountID,
    },
    select: {
      id: true,
    },
  });
};

export const isOwned = (attribute: actCourse, accountID: string) => {
  return db.course.findFirst({
    where: {
      AND: {
        id: attribute.courseID,
        account_id: accountID,
      },
    },
  });
};
