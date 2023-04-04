import clsx from "clsx";

import {ChatRoomWithLatestChatMessage as TChatRoom} from "../types";

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
                "px-2 py-1 text-left hover:bg-black/5",
                selected && "bg-blue-600 text-white hover:bg-blue-600",
            )}
            type={"button"}
            onClick={onClick}
        >
            <span className={"block"}>{chatRoom.name}</span>
            <span className={"line-clamp-1 text-sm opacity-50"}>
                {`${chatRoom.latestChatMessage.sender.name}: ${chatRoom.latestChatMessage.text}`}
            </span>
        </button>
    </li>
);
