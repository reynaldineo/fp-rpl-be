import { Algorithm, Options, hash, verify } from "@node-rs/argon2";

const options: Options = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

/**
 * Hash a password
 * @param {string | Buffer} password - password string that need to be hashed
 * @returns {Promise<string>} - return the hashed password
 */
export const Hash = async (password: string | Buffer) => {
  return await hash(password, options);
};

/**
 * Description of the function.
 * @param {string | Buffer} hash - Hashed password
 * @param {string | Buffer} password - plain-text password
 * @returns {Promise<boolean>} - return if the hash equal to the plain-text password
 */
export const Verify = async (hash: string | Buffer, password: string | Buffer) => {
  return await verify(hash, password);
};
