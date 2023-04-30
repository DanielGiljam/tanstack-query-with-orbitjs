import {useLiveQueryClient} from "@tanstack-query-with-orbitjs/react";
import React from "react";
import {io} from "socket.io-client";

import {onNewChatMessage} from "../query";
import {ChatMessageWithSender, ChatRoomRecord} from "../types";

import {ChatRoom} from "./ChatRoom";
import {ChatRoomList} from "./ChatRoomList";

export const App = () => {
    const queryClient = useLiveQueryClient();
    const [selectedChatRoom, setSelectedChatRoom] =
        React.useState<ChatRoomRecord | null>(null);
    React.useEffect(() => {
        const socket = io({path: "/api/socket"});
        socket.connect();
        console.log("connected to socket", socket);
        socket.on("new-chat-message", (chatMessage: ChatMessageWithSender) => {
            onNewChatMessage(queryClient, chatMessage).catch((error) =>
                console.error(error),
            );
        });
        return () => {
            console.log("disconnected from socket", socket);
            socket.disconnect();
        };
    }, [queryClient]);
    return (
        <div className={"flex h-screen min-w-[720px] overflow-hidden"}>
            <div className={"flex flex-col"}>
                <div className={"h-10 p-2"}>
                    <span className={"text-lg font-semibold leading-none"}>
                        Chat rooms
                    </span>
                </div>
                <hr />
                <ChatRoomList
                    selectedChatRoom={selectedChatRoom}
                    setSelectedChatRoom={setSelectedChatRoom}
                />
            </div>
            <hr className={"h-auto w-0 border-s border-t-0"} />
            {selectedChatRoom != null ? (
                <ChatRoom chatRoom={selectedChatRoom} />
            ) : (
                <div className={"flex flex-grow items-center justify-center"}>
                    <span>No chat room selected</span>
                </div>
            )}
        </div>
    );
};
