/*
  Warnings:

  - The primary key for the `config` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupId` on the `config` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "config" DROP CONSTRAINT "config_pkey",
DROP COLUMN "groupId",
ADD CONSTRAINT "config_pkey" PRIMARY KEY ("key");