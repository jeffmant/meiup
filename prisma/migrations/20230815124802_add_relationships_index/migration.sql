-- CreateIndex
CREATE INDEX `Company_societyId_idx` ON `Company`(`societyId`);

-- CreateIndex
CREATE INDEX `Party_companyId_idx` ON `Party`(`companyId`);

-- CreateIndex
CREATE INDEX `Society_userId_idx` ON `Society`(`userId`);

-- CreateIndex
CREATE INDEX `Transaction_companyId_idx` ON `Transaction`(`companyId`);
