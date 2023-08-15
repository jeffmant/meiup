/*
  Warnings:

  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Company` DROP FOREIGN KEY `Company_societyId_fkey`;

-- DropForeignKey
ALTER TABLE `Party` DROP FOREIGN KEY `Party_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `Society` DROP FOREIGN KEY `Society_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_companyId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `clerkUserId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_clerkUserId_key` ON `User`(`clerkUserId`);
