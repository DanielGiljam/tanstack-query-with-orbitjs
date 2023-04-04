import {QueryFunction, useQuery} from "@tanstack/react-query";

import {ChatRoomWithLatestChatMessage as TChatRoom} from "../types";

import {ChatRoomListItem} from "./ChatRoomListItem";

const queryFn: QueryFunction<TChatRoom[]> = async () => {
    const res = await fetch("/api/chat-rooms");
    return await res.json();
};

interface ChatRoomListProps {
    selectedChatRoomId: string | null;
    setSelectedChatRoomId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ChatRoomList = ({
    selectedChatRoomId,
    setSelectedChatRoomId,
}: ChatRoomListProps) => {
    const {data: chatRooms} = useQuery({
        queryKey: ["chat-rooms"],
        queryFn,
    });
    return (
        <ul className={"w-60"}>
            {chatRooms?.map((chatRoom) => (
                <ChatRoomListItem
                    key={chatRoom.id}
                    chatRoom={chatRoom}
                    selected={chatRoom.id === selectedChatRoomId}
                    onClick={() => setSelectedChatRoomId(chatRoom.id)}
                />
            ))}
        </ul>
    );
};
