/*
  Warnings:

  - The values [CUSTOMER,SUPPLIER] on the enum `Party_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `Society` table. All the data in the column will be lost.
  - The values [RECEIPT,COST] on the enum `Transaction_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[societyId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId]` on the table `Society` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Society` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Company_societyId_idx` ON `Company`;

-- DropIndex
DROP INDEX `Society_userId_idx` ON `Society`;

-- AlterTable
ALTER TABLE `Company` MODIFY `societyId` VARCHAR(191) NULL,
    MODIFY `addressId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Party` MODIFY `type` ENUM('customer', 'supplier') NOT NULL;

-- AlterTable
ALTER TABLE `Society` DROP COLUMN `userId`,
    ADD COLUMN `companyId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `type` ENUM('receipt', 'cost') NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE `UserSociety` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `societyId` VARCHAR(191) NOT NULL,

    INDEX `UserSociety_societyId_idx`(`societyId`),
    INDEX `UserSociety_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Company_societyId_key` ON `Company`(`societyId`);

-- CreateIndex
CREATE UNIQUE INDEX `Society_companyId_key` ON `Society`(`companyId`);

-- CreateIndex
CREATE INDEX `Society_companyId_idx` ON `Society`(`companyId`);
