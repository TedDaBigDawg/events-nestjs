/*
  Warnings:

  - You are about to drop the column `invitationId` on the `Attendee` table. All the data in the column will be lost.
  - Added the required column `invitationId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendee" DROP CONSTRAINT "Attendee_invitationId_fkey";

-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "invitationId";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "invitationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
