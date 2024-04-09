import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class RegisterDTO {
  @IsEmail()
  @MaxLength(100)
  public email: string;

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

/*
model account 
  id          String    @id @default(uuid())  
  email       String    @unique @db.VarChar(100)
  password    String    @db.VarChar(255)
  role        Role   
*/
