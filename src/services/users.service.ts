import { Service } from "typedi";
import { User } from "../interfaces/users.interface.js";
import { HttpException } from "../exceptions/HttpException.js";
import { prisma } from "../prisma/prisma.js";

@Service()
export class UserService {
  // Add your psima query for user here

  // Sample prisma query function
  public async SamplePrisma(userId: number): Promise<User> {
    const findUser: User = await prisma.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
