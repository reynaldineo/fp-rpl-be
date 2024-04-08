import { Service } from "typedi";
import db from "../config/database.js";

@Service()
export class UserService {
  /**
   * Get the details of a user by account Id
   * @param {string} id - The id of the user
   * @returns {Promise<account>} A promise that resolves to the user roles
   */
  public async GetDetails(id: string) {
    return await db.account.findUnique({
      select: { id: true, role: true, created_at: true, bio: true },
      where: { id: id },
    });
  }

  /**
   * Get the roles of a user by accountId
   * @param {string} id - The id of the user
   * @returns {Promise<Role>} A promise that resolves to the user roles
   */
  public async GetRoles(id: string) {
    return await db.account.findUnique({
      select: { role: true },
      where: { id: id },
    });
  }

  /**
   * Check if a user exists with the given email
   * @param {string} email - The email of the user
   * @returns {Promise<boolean>} A promise that resolves to true if the user exists, otherwise false
   */
  public async CheckUserByEmail(email: string) {
    const userId = await db.account.findUnique({
      select: { id: true },
      where: { email: email },
    });
    return userId !== null ? true : false;
  }
}
