/* eslint-disable */
import { PrismaClient, Prisma } from "@prisma/client";

declare global {
  var _db: PrismaClient | undefined;
}

if (!global._db) {
  global._db = new PrismaClient({
    log: [{ emit: "event", level: "query" }],
  });
}

const db: PrismaClient = global._db;

db.$on("query" as never, async (e: Prisma.QueryEvent) => {
  console.log(`Query : ${e.query}`);
  console.log(`Params : ${e.params}`);
  console.log(`Duration : ${e.duration}ms`);
});

export default db;
