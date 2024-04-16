import { Prisma } from "@prisma/client";

export const courseInfo: Prisma.courseSelect = {
  id: true,
  url: true,
  img_cover: true,
  title: true,
  label: true,
  caption: true,
  like_count: true,
  account: {
    select: {
      username: true,
    },
  },
};

export const commentInfo: Prisma.commentSelect = {
  account: {
    select: {
      username: true,
    },
  },
  comment: true,
};

export const courseDetail: Prisma.courseInclude = {
  account: {
    select: {
      username: true,
    },
  },
  comment: {
    select: commentInfo,
  },
};

export const courseProd: Prisma.productSelect = {
  id: true,
  img_url: true,
  name: true,
  price: true,
};
