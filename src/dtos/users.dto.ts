import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from "class-validator";

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
