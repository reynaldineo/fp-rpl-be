import { PrismaClient } from "@prisma/client";

// Initialize prisma client
export const prisma = new PrismaClient({
  log: [{ emit: "event", level: "query" }],
});

// Output log
prisma.$on("query", async (e) => {
  console.log(`Query : ${e.query}`);
  console.log(`Params : ${e.params}`);
  console.log(`Duration : ${e.duration}ms`);
});