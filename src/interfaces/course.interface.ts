import { Label } from "@prisma/client";

export interface addComment {
  courseID: string;
  comment: string;
}

export interface actCourse {
  courseID?: string;
  url?: string;
  img_cover?: string;
  title?: string;
  caption?: string;
  label?: Label;
}
