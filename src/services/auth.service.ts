import { Service } from "typedi";
import { RegisterAccount } from "../interfaces/auth.interface.js";
import db from "../config/database.js";
import { HttpException } from "../exceptions/HttpException.js";
import { Verify } from "../utils/Argon2id.js";
import { LoginDTO } from "../dtos/auth.dto.js";
import { CreateToken } from "../utils/jwt.js";

@Service()
export class AuthService {
  /**
   * Register a new account to the database
   * @param {RegisterAccount} account - The account object
   * @returns {Promise<Account>} A promise that resolves to the created account
   */
  public async addAccount(account: RegisterAccount) {
    return await db.$transaction(async (tx) => {
      const createdAccount = await tx.account.create({
        data: {
          email: account.email,
          password: account.password,
        },
      });

      await tx.cart.create({ data: { account_id: createdAccount.id, current_cost: 0 } });
      return createdAccount;
    });
  }

  /**
   * Authenticates a user by checking their email and password
   * @param {LoginDTO} account - The login information
   * @returns A promise that resolves to an object containing the user's ID , role, and password
   * @throws {HttpException} Throws a 400 error if the email is not found or if the password is incorrect
   */
  public async login(account: LoginDTO) {
    const user = await db.account.findFirst({
      select: { id: true, role: true, password: true },
      where: { email: account.email },
    });

    if (!user) throw new HttpException(400, "Email not found !");
    if (!(await Verify(user.password, account.password))) throw new HttpException(400, "Wrong email or Password");

    const jwt = await CreateToken(user.id);
    return { id: user.id, role: user.role, jwt };
  }

  /**
   * Creates a cookie with the provided token. Default expiration is 7 days
   * @param {string} token - The token to be stored in the cookie
   * @returns {string} A string representing the cookie
   */
  public CreateCookie(token: string): string {
    return `FP_Authorization=${token}; Expires=${new Date(Date.now() + 604800000)}; Path=/`;
  }
}
