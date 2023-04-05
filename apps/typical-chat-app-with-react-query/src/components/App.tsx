import React from "react";

import {ChatRoom} from "./ChatRoom";
import {ChatRoomList} from "./ChatRoomList";

export const App = () => {
    const [selectedChatRoomId, setSelectedChatRoomId] = React.useState<
        string | null
    >(null);
    return (
        <div className={"flex h-screen min-w-[720px]"}>
            <ChatRoomList
                selectedChatRoomId={selectedChatRoomId}
                setSelectedChatRoomId={setSelectedChatRoomId}
            />
            <hr className={"h-auto w-0 border-s border-t-0"} />
            {selectedChatRoomId != null ? (
                <ChatRoom chatRoomId={selectedChatRoomId} />
            ) : (
                <div className={"flex flex-grow items-center justify-center"}>
                    <span>No chat room selected</span>
                </div>
            )}
        </div>
    );
};
