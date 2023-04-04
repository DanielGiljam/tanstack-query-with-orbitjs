import {ChatMessage, ChatRoom, User} from "../prisma";

export type ChatRoomWithLatestChatMessage = Pick<ChatRoom, "id" | "name"> & {
    latestChatMessageId: string;
    latestChatMessage: Omit<ChatMessage, "chatRoomId"> & {sender: User};
};
