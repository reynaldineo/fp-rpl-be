import { SECRET_KEY } from "../config/index.js";
import pkg, { JwtPayload } from "jsonwebtoken";

const { sign, verify } = pkg;
/**
 * Creates a JWT token asynchronously
 * @param {string} id - The identifier to include in the token
 * @returns {Promise<string>} A promise that resolves to the generated JWT token
 * @throws {Error} Throws an error if there's an issue when generating the token
 */
export const CreateToken = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign({ id: id }, SECRET_KEY, { expiresIn: "7d", algorithm: "HS256" }, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
};

/**
 * Verify a JWT token asynchronously
 * @param {string} token - JWT Token
 * @returns {Promise<string | JwtPayload>} A promise that resolves to the JwtPayload if it exist
 * @throws {Error} Throws an error if there's an issue when generating the token
 */
export const VerifyToken = (token: string): Promise<string | JwtPayload> => {
  return new Promise((resolve, reject) => {
    verify(token, SECRET_KEY, (error, decoded) => {
      if (error) {
        reject(error.message);
      } else {
        resolve(decoded);
      }
    });
  });
};
