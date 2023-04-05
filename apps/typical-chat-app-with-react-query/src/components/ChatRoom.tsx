import {ChatMessageInput} from "./ChatMessageInput";
import {ChatMessageList} from "./ChatMessageList";

interface ChatRoomProps {
    chatRoomId: string;
}

export const ChatRoom = ({chatRoomId}: ChatRoomProps) => {
    return (
        <div className={"relative flex-grow"}>
            <ChatMessageList chatRoomId={chatRoomId} />
            <ChatMessageInput chatRoomId={chatRoomId} />
        </div>
    );
};
