/*
  Warnings:

  - Added the required column `partyName` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `partyName` VARCHAR(191) NOT NULL;
