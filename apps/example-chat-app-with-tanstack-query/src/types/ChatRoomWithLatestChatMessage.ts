import {ChatRoom} from "../prisma";

import {ChatMessageWithSender} from "./ChatMessageWithSender";
import {StringifyDates} from "./StringifyDates";

export type ChatRoomWithLatestChatMessage = StringifyDates<
    ChatRoom & {
        latestChatMessageId: string;
        latestChatMessage: Omit<ChatMessageWithSender, "chatRoomId">;
    }
>;
