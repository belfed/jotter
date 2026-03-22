/*
  Warnings:

  - Added the required column `userId` to the `inbox_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_inboxItemId_fkey";

-- AlterTable
ALTER TABLE "inbox_items" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "inbox_items" ADD CONSTRAINT "inbox_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_inboxItemId_fkey" FOREIGN KEY ("inboxItemId") REFERENCES "inbox_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
