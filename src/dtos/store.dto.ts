import { IsInt, IsString, MaxLength, Min } from "class-validator";

export class updateCartDTO {
  @IsInt({ message: "Quantity must be an integer" })
  @Min(0, { message: "Quantity must be greater or equal to 0" })
  public qty: number;
}

export class updateProdDTO {
  @IsString({ message: "Title must be a string" })
  @MaxLength(100, { message: "Title must be less than 100 characters" })
  public name: string;

  @IsInt({ message: "Price must be an integer" })
  @Min(0, { message: "Price must be greater or equal to 0" })
  public price: number;

  @IsInt({ message: "Stock must be an integer" })
  @Min(0, { message: "Stock must be greater or equal to 0" })
  public stock: number;

  @IsString({ message: "Description must be a string" })
  public description: string;
}
