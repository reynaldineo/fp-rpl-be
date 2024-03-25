import { Container } from "typedi";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  public auth = Container.get(AuthService);

  /*
    Define your function for the endpoint
  */
}
