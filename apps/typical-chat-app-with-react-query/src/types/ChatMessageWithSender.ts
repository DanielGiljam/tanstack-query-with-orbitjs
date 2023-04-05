import {ChatMessage, User} from "../prisma";

export type ChatMessageWithSender = ChatMessage & {sender: User};
