import { Label } from "@prisma/client";
import { IsEnum, IsString, MaxLength } from "class-validator";

export class courseInputDTO {
  @IsString({ message: "Title must be a string" })
  @MaxLength(100, { message: "Title cannot be longer than 100 characters" })
  public title: string;

  @IsEnum(Label, { message: "Label is not valid" })
  public label: Label;

  @IsString({ message: "Caption must be a string" })
  public caption: string;
}

export class addCommentDTO {
  @IsString({ message: "Comment must be a string" })
  public comment: string;
}
