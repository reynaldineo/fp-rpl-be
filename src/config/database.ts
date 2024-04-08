/* eslint-disable */
import { PrismaClient, Prisma} from "@prisma/client";

declare global {
  var _db: PrismaClient | undefined;
}
    
if(!global._db) {
  global._db = new PrismaClient({
    log: [{ emit: "event", level: "query" }],
  });
}

// Output log . Please don't remove as this is usefull for development :)
global._db.$on("query" as never, async (e: Prisma.QueryEvent) => {
    console.log(`Query : ${e.query}`);
    console.log(`Params : ${e.params}`);
    console.log(`Duration : ${e.duration}ms`);
  });
  

const db = global._db;
export default db;
