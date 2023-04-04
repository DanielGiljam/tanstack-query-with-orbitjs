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
            <ChatRoom chatRoomId={selectedChatRoomId} />
        </div>
    );
};
