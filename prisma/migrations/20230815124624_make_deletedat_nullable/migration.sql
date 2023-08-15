-- DropIndex
DROP INDEX `Company_societyId_fkey` ON `Company`;

-- DropIndex
DROP INDEX `Party_companyId_fkey` ON `Party`;

-- DropIndex
DROP INDEX `Society_userId_fkey` ON `Society`;

-- DropIndex
DROP INDEX `Transaction_companyId_fkey` ON `Transaction`;

-- AlterTable
ALTER TABLE `Company` MODIFY `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Party` MODIFY `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Society` MODIFY `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `deletedAt` DATETIME(3) NULL;
