import { Role } from "@prisma/client";
import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsEmail, IsEnum } from "class-validator";

export class SampleTestDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(64)
  public str: string;

  @IsNumber()
  @IsNotEmpty()
  public temperature: number;
}

export class UpdateUserDTO {
  @IsEmail()
  @MaxLength(100)
  public email?: string;

  @IsString()
  @MaxLength(255)
  public password?: string;

  @IsEnum(Role)
  public role?: Role;

  @IsString()
  public bio?: string;
}
