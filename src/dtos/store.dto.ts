import { Min } from "class-validator";

export class updateCartDTO {
  @Min(0, { message: "Quantity must be greater or equal to 0" })
  public qty: number;
}
