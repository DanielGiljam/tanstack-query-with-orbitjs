import {ChatRoomWithLatestChatMessage as TChatRoom} from "../types";

import {ChatMessageInput} from "./ChatMessageInput";
import {ChatMessageList} from "./ChatMessageList";

interface ChatRoomProps {
    chatRoom: TChatRoom;
}

export const ChatRoom = ({chatRoom}: ChatRoomProps) => {
    return (
        <div className={"flex flex-grow flex-col"}>
            <div className={"h-10 px-4 py-2"}>
                <span className={"text-xl leading-none"}>{chatRoom.name}</span>
            </div>
            <hr />
            <div className={"relative flex-grow overflow-hidden"}>
                <ChatMessageList chatRoomId={chatRoom.id} />
                <ChatMessageInput chatRoomId={chatRoom.id} />
            </div>
        </div>
    );
};
