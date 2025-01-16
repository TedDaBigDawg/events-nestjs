-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "invite_link" TEXT,
ADD COLUMN     "isReusable" BOOLEAN NOT NULL DEFAULT false;
