import React from "react";

import {ChatRoomWithLatestChatMessage as TChatRoom} from "../types";

import {ChatRoom} from "./ChatRoom";
import {ChatRoomList} from "./ChatRoomList";

export const App = () => {
    const [selectedChatRoom, setSelectedChatRoom] =
        React.useState<TChatRoom | null>(null);
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
