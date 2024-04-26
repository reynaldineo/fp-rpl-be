import { Service } from "typedi";
import db from "../config/database.js";
import { UpdateUser } from "../interfaces/users.interface.js";

@Service()
export class UserService {
  /**
   * Update the supplied properties of a user by account Id
   * @param {string} id - The id of the user
   * @param {UpdateUser} - Properties that are need to be updated
   * @returns {Promise<account>} A promise that resolves to the updated value
   */
  public async UpdateProperties(id: string, props: UpdateUser) {
    return await db.account.update({
      select: { id: true, email: true, username: true, bio: true },
      where: { id: id },
      data: {
        email: props.email,
        username: props.username,
        bio: props.bio,
      },
    });
  }

  /**
   * Get the details of a user by account Id
   * @param {string} id - The id of the user
   * @returns {Promise<account>} A promise that resolves to the account
   */
  public async GetDetails(id: string) {
    return await db.account.findUnique({
      select: { id: true, email: true, username: true, created_at: true, bio: true },
      where: { id: id },
    });
  }

  /**
   * Check if a user exists with the given email
   * @param {string} email - The email of the user
   * @returns {Promise<boolean>} A promise that resolves to true if the user exists, otherwise false
   */
  public async CheckUserByEmail(email: string) {
    const userId = await db.account.findFirst({
      select: { id: true },
      where: { email: email },
    });
    return userId !== null ? true : false;
  }

  public async CheckUserByUsername(username: string) {
    const userId = await db.account.findFirst({
      select: { id: true },
      where: { username: username },
    });
    return userId !== null ? true : false;
  }
}
