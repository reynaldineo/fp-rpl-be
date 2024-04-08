/*
  Warnings:

  - You are about to alter the column `password` on the `account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Char(98)`.

*/
-- AlterTable
ALTER TABLE "account" ALTER COLUMN "password" SET DATA TYPE CHAR(98),
ALTER COLUMN "role" DROP NOT NULL;
