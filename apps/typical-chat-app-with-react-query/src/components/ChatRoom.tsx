interface ChatRoomProps {
    chatRoomId: string | null;
}

export const ChatRoom = ({chatRoomId}: ChatRoomProps) => {
    return <div className={"flex-grow"}>ChatRoom {chatRoomId}</div>;
};
