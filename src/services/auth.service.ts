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
   * Register a new account to the database.
   * @param {RegisterAccount} account - The account object.
   * @returns {Promise<Account>} A promise that resolves to the created account.
   */
  public async addAccount(account: RegisterAccount) {
    return await db.account.create({
      data: {
        email: account.email,
        password: account.password,
        created_at: account.created_at,
      },
    });
  }

  /**
   * Authenticates a user by checking their email and password.
   * @param {LoginDTO} account - The login information
   * @returns {Promise<{ id: number, role: string }>} A promise that resolves to an object containing the user's ID and role.
   * @throws {HttpException} Throws a 400 error if the email is not found or if the password is incorrect.
   */
  public async login(account: LoginDTO) {
    const user = await db.account.findUnique({
      select: { id: true, role: true, password: true },
      where: { email: account.email },
    });

    // eslint-disable-next-line prettier/prettier
    if (!user) throw new HttpException(400, "Email not found !");
    // eslint-disable-next-line prettier/prettier
    if (!(await Verify(user.password, account.password))) throw new HttpException(400, "Wrong email or Password");

    const jwt = await CreateToken(user.id);

    return { id: user.id, role: user.role, jwt };
  }

  /**
   * Creates a cookie with the provided token. Default expiration is 7 days
   *
   * @param {string} token - The token to be stored in the cookie.
   * @returns {string} A string representing the cookie.
   */
  public CreateCookie(token: string): string {
    return `FP_Authorization=${token}; Expires=${new Date(Date.now() + 604800000)}; Path=/`;
  }
}
