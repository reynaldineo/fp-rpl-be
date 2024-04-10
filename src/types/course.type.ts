import { Prisma } from "@prisma/client";

export const courseInfo: Prisma.courseSelect = {
  id: true,
  url: true,
  title: true,
  label: true,
  like_count: true,
  account: {
    select: {
      username: true,
    },
  },
};

export const courseInfoByUsername: Prisma.courseSelect = {
  id: true,
  url: true,
  title: true,
  label: true,
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
      email: true,
    },
  },
  comment: true,
};

export const courseDetail: Prisma.courseSelect = {
  id: true,
  url: true,
  title: true,
  caption: true,
  label: true,
  like_count: true,
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
