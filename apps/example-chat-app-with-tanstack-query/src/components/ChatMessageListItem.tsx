import {format, formatDistance, isSameDay} from "date-fns";

import {ChatMessageWithSender as TChatMessage} from "../types";

const today = new Date();

const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    if (isSameDay(date, today)) {
        return format(date, "H:mm");
    } else {
        return formatDistance(date, today, {addSuffix: true});
    }
};

interface ChatMessageListProps {
    chatMessage: TChatMessage;
}

export const ChatMessageListItem = ({chatMessage}: ChatMessageListProps) => (
    <li className={"mx-auto w-full px-2 py-1 text-left hover:bg-black/5"}>
        <span className={"flex items-baseline"}>
            <span className={"mr-1 text-sm font-bold"}>
                {chatMessage.sender.name}
            </span>
            <span className={"truncate text-sm opacity-50"}>
                {formatCreatedAt(chatMessage.createdAt)}
            </span>
        </span>
        <span className={""}>{chatMessage.text}</span>
    </li>
);
