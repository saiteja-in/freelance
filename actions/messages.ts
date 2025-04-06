// actions/messages.ts
"use server";

import { revalidatePath } from "next/cache"; // Optional if you use SSR paths
import { pusherServer } from "@/lib/pusher";  // Adjust this import to your actual Pusher setup
import { db } from "@/lib/db";

export async function getMessages(userId: string, partnerId: string) {
  try {
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export const sendMessage = async ({
  senderId,
  receiverId,
  content,
}: {
  senderId: string;
  receiverId: string;
  content: string;
}) => {
  try {
    const message = await db.message.create({
      data: {
        senderId,
        receiverId,
        content,
        timestamp: new Date(),
      },
    });

    // Trigger the Pusher event to broadcast the new message
    await pusherServer.trigger("chat", "new-message", message);

    return message;
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
};
