import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class RegisterDTO {
  @IsEmail()
  @MaxLength(100)
  public email: string;

  @IsString()
  @MaxLength(50)
  public username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public password: string;
}

export class LoginDTO {
  @IsEmail()
  @MaxLength(100)
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public password: string;
}
