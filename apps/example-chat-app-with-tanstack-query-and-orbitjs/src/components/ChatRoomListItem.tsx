import {QueryMeta, useLiveQuery} from "@tanstack-query-with-orbitjs/react";
import clsx from "clsx";
import {format, formatDistance, isSameDay} from "date-fns";
import React from "react";

import {
    ChatMessageRecord as TChatMessage,
    ChatRoomRecord as TChatRoom,
    UserRecord as TUser,
} from "../types";

const chatMessagesBeforeMeta: QueryMeta = {
    getQueryOrExpressions: (qb, [, chatRoomId, , latestChatMessageCreatedAt]) =>
        qb
            .findRelatedRecords(
                {type: "chatRoom", id: chatRoomId as string},
                "chatMessages",
            )
            .filter({
                op: "lte",
                attribute: "createdAt",
                value: latestChatMessageCreatedAt as Date,
            })
            .sort("-createdAt")
            .page({limit: 1}),
};

const senderMeta: QueryMeta = {
    getQueryOrExpressions: (qb, [, chatMessageId]) =>
        qb.findRelatedRecord(
            {type: "chatMessage", id: chatMessageId as string},
            "sender",
        ),
};

const today = new Date();

const formatLatestChatMessageCreatedAt = (date: Date) => {
    if (isSameDay(date, today)) {
        return format(date, "H:mm");
    } else {
        return formatDistance(date, today, {addSuffix: true});
    }
};

interface ChatRoomListProps {
    chatRoom: TChatRoom;
    selected: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const ChatRoomListItem = ({
    chatRoom,
    selected,
    onClick,
}: ChatRoomListProps) => {
    const {data: [latestChatMessage] = []} = useLiveQuery<TChatMessage[]>({
        queryKey: [
            "chat-room",
            chatRoom.id,
            "chat-messages-before",
            chatRoom.attributes.latestChatMessageCreatedAt,
        ],
        keepPreviousData: true,
        meta: chatMessagesBeforeMeta,
    });
    const {data: sender} = useLiveQuery<TUser>({
        queryKey: ["chat-message", latestChatMessage.id, "sender"],
        keepPreviousData: true,
        meta: senderMeta,
    });
    return (
        <li>
            <button
                className={clsx(
                    "w-full px-2 py-1 text-left hover:bg-black/5",
                    selected && "bg-blue-600 text-white hover:bg-blue-600",
                )}
                type={"button"}
                onClick={onClick}
            >
                <span className={"flex items-baseline"}>
                    <span className={"mr-1 flex-grow truncate leading-6"}>
                        {chatRoom.attributes.name}
                    </span>
                    <span className={"truncate text-sm leading-6 opacity-50"}>
                        {formatLatestChatMessageCreatedAt(
                            chatRoom.attributes.latestChatMessageCreatedAt,
                        )}
                    </span>
                </span>
                <span className={"line-clamp-1 text-sm opacity-50"}>
                    {`${sender!.attributes.name}: ${
                        latestChatMessage.attributes.text
                    }`}
                </span>
            </button>
        </li>
    );
};
