/*
  Warnings:

  - The values [receipt] on the enum `Transaction_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Transaction` MODIFY `type` ENUM('revenue', 'cost') NOT NULL;
