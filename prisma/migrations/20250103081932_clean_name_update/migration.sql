/*
  Warnings:

  - A unique constraint covering the columns `[cleanName]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_cleanName_key" ON "Event"("cleanName");
