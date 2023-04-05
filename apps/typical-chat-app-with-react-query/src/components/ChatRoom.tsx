interface ChatRoomProps {
    chatRoomId: string;
}

export const ChatRoom = ({chatRoomId}: ChatRoomProps) => {
    return <div className={"flex-grow"}>ChatRoom {chatRoomId}</div>;
};
