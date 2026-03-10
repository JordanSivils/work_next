-- CreateTable
CREATE TABLE "MissedInventory" (
    "id" UUID NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "missedCount" INTEGER NOT NULL DEFAULT 0,
    "userId" UUID NOT NULL,

    CONSTRAINT "MissedInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MissedInventory_month_idx" ON "MissedInventory"("month");

-- CreateIndex
CREATE UNIQUE INDEX "MissedInventory_userId_month_key" ON "MissedInventory"("userId", "month");

-- AddForeignKey
ALTER TABLE "MissedInventory" ADD CONSTRAINT "MissedInventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
