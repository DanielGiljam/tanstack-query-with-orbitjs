import {ChatRoom} from "../prisma";

import {ChatMessageWithSender} from "./ChatMessageWithSender";

export type ChatRoomWithLatestChatMessage = ChatRoom & {
    latestChatMessageId: string;
    latestChatMessage: Omit<ChatMessageWithSender, "chatRoomId">;
};
