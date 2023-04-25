import clsx from "clsx";
import {format, formatDistance, isSameDay} from "date-fns";

import {ChatRoomWithLatestChatMessage as TChatRoom} from "../types";

const today = new Date();

const formatLatestChatMessageCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
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
}: ChatRoomListProps) => (
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
                    {chatRoom.name}
                </span>
                <span className={"truncate text-sm leading-6 opacity-50"}>
                    {formatLatestChatMessageCreatedAt(
                        chatRoom.latestChatMessage.createdAt,
                    )}
                </span>
            </span>
            <span className={"line-clamp-1 text-sm opacity-50"}>
                {`${chatRoom.latestChatMessage.sender.name}: ${chatRoom.latestChatMessage.text}`}
            </span>
        </button>
    </li>
);
