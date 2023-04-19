import {ChatMessageWithSender as TChatMessage} from "../types";

interface ChatMessageListProps {
    chatMessage: TChatMessage;
}

export const ChatMessageListItem = ({chatMessage}: ChatMessageListProps) => (
    <li
        className={
            "mx-auto w-full max-w-[38rem] px-2 py-1 text-left hover:bg-black/5"
        }
    >
        <span className={"block text-sm font-bold"}>
            {chatMessage.sender.name}
        </span>
        <span className={""}>{chatMessage.text}</span>
    </li>
);
