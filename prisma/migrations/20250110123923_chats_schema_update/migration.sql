/*
  Warnings:

  - You are about to drop the `ChatRoomAttendees` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatRoomAttendees" DROP CONSTRAINT "ChatRoomAttendees_attendee_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoomAttendees" DROP CONSTRAINT "ChatRoomAttendees_chat_room_id_fkey";

-- DropTable
DROP TABLE "ChatRoomAttendees";

-- CreateTable
CREATE TABLE "_AttendeeToChatRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AttendeeToChatRoom_AB_unique" ON "_AttendeeToChatRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_AttendeeToChatRoom_B_index" ON "_AttendeeToChatRoom"("B");

-- AddForeignKey
ALTER TABLE "_AttendeeToChatRoom" ADD CONSTRAINT "_AttendeeToChatRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttendeeToChatRoom" ADD CONSTRAINT "_AttendeeToChatRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
