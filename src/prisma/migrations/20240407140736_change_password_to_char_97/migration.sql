/*
  Warnings:

  - You are about to alter the column `password` on the `account` table. The data in that column could be lost. The data in that column will be cast from `Char(98)` to `Char(97)`.

*/
-- AlterTable
ALTER TABLE "account" ALTER COLUMN "password" SET DATA TYPE CHAR(97);
