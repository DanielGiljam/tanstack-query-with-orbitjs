import {ChatMessage, User} from "../prisma";

import {StringifyDates} from "./StringifyDates";

export type ChatMessageWithSender = StringifyDates<
    ChatMessage & {sender: User}
>;
