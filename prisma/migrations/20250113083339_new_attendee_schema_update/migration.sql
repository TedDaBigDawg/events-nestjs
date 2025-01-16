/*
  Warnings:

  - Added the required column `invitationId` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "invitationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
