import {QueryFunction, useQuery} from "@tanstack/react-query";

import {ChatRoomWithLatestChatMessage as TChatRoom} from "../types";

import {ChatRoomListItem} from "./ChatRoomListItem";

const queryFn: QueryFunction<TChatRoom[]> = async () => {
    const res = await fetch("/api/chat-rooms");
    return await res.json();
};

interface ChatRoomListProps {
    selectedChatRoom: TChatRoom | null;
    setSelectedChatRoom: React.Dispatch<React.SetStateAction<TChatRoom | null>>;
}

export const ChatRoomList = ({
    selectedChatRoom,
    setSelectedChatRoom,
}: ChatRoomListProps) => {
    const {data: chatRooms} = useQuery({
        queryKey: ["chat-rooms"],
        queryFn,
    });
    return (
        <ul className={"w-[240px] flex-grow overflow-y-auto"}>
            {chatRooms?.map((chatRoom) => (
                <ChatRoomListItem
                    key={chatRoom.id}
                    chatRoom={chatRoom}
                    selected={chatRoom.id === selectedChatRoom?.id}
                    onClick={() => setSelectedChatRoom(chatRoom)}
                />
            ))}
        </ul>
    );
};
