import { Container } from "typedi";
import { StoreService } from "../services/store.service.js";

export class StoreController {
  public store = Container.get(StoreService);
  /*
    Define your function for the endpoint
  */
}
