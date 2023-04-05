import {QueryFunction, useQuery} from "@tanstack/react-query";

import {ChatMessageWithSender as TChatMessage} from "../types";

import {ChatMessageListItem} from "./ChatMessageListItem";

const queryFn: QueryFunction<
    TChatMessage[],
    ["chat-messages", string]
> = async (ctx) => {
    const res = await fetch(`/api/chat-room/${ctx.queryKey[1]}/chat-messages`);
    return await res.json();
};

interface ChatMessageListProps {
    chatRoomId: string;
}

export const ChatMessageList = ({chatRoomId}: ChatMessageListProps) => {
    const {data: chatMessages} = useQuery({
        queryKey: ["chat-messages", chatRoomId],
        queryFn,
    });
    return (
        <ul
            className={
                "mx-auto flex h-full w-full flex-grow flex-col-reverse overflow-y-auto px-8 pb-[4.5rem] pt-2"
            }
        >
            {chatMessages?.map((chatMessage) => (
                <ChatMessageListItem
                    key={chatMessage.id}
                    chatMessage={chatMessage}
                />
            ))}
        </ul>
    );
};
