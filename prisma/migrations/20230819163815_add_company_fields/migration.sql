-- AlterTable
ALTER TABLE `Company` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `foundationDate` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false;
