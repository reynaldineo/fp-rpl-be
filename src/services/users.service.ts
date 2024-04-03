import { Service } from "typedi";
import { HttpException } from "../exceptions/HttpException.js";
import { prisma } from "../prisma/prisma.js";

@Service()
export class UserService {
  // Add your psima query for user here

  // Sample prisma query function
  public async SamplePrisma(userId: string) {
    const findUser = await prisma.account.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
