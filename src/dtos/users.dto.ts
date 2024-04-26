import { IsString, MaxLength, IsEmail } from "class-validator";

export class UpdateUserDTO {
  @IsEmail()
  @MaxLength(100)
  public email?: string;

  @IsString()
  @MaxLength(50)
  public username?: string;

  @IsString()
  public bio?: string;
}
