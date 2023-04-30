import {QueryMeta, useLiveQuery} from "@tanstack-query-with-orbitjs/react";
import {format, formatDistance, isSameDay} from "date-fns";

import {ChatMessageRecord as TChatMessage, UserRecord as TUser} from "../types";

const meta: QueryMeta = {
    getQueryOrExpressions: (qb, [, chatMessageId]) =>
        qb.findRelatedRecord(
            {type: "chatMessage", id: chatMessageId as string},
            "sender",
        ),
};

const today = new Date();

const formatCreatedAt = (date: Date) => {
    if (isSameDay(date, today)) {
        return format(date, "H:mm");
    } else {
        return formatDistance(date, today, {addSuffix: true});
    }
};

interface ChatMessageListProps {
    chatMessage: TChatMessage;
}

export const ChatMessageListItem = ({chatMessage}: ChatMessageListProps) => {
    const {data: user} = useLiveQuery<TUser>({
        queryKey: ["chat-message", chatMessage.id, "sender"],
        meta,
    });
    return (
        <li className={"mx-auto w-full px-2 py-1 hover:bg-black/5"}>
            <span className={"flex items-baseline"}>
                <span className={"mr-1 text-sm font-bold"}>
                    {user!.attributes.name}
                </span>
                <span className={"truncate text-sm opacity-50"}>
                    {formatCreatedAt(chatMessage.attributes.createdAt)}
                </span>
            </span>
            <span className={""}>{chatMessage.attributes.text}</span>
        </li>
    );
};
