/*
  Warnings:

  - A unique constraint covering the columns `[eventId,email]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,phone]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendee_eventId_email_key" ON "Attendee"("eventId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_eventId_phone_key" ON "Attendee"("eventId", "phone");
