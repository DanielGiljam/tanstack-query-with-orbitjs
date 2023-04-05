import {MutationFunction, useMutation} from "@tanstack/react-query";
import React from "react";

import {ChatMessageWithSender as TChatMessage} from "../types";

const mutationFn: MutationFunction<
    TChatMessage,
    {chatRoomId: string; text: string}
> = async ({chatRoomId, text}) => {
    const res = await fetch(`/api/chat-room/${chatRoomId}/chat-message`, {
        method: "POST",
        headers: {
            contentType: "application/json",
        },
        body: JSON.stringify({text}),
    });
    return await res.json();
};

interface ChatMessageInputProps {
    chatRoomId: string;
}

export const ChatMessageInput = ({chatRoomId}: ChatMessageInputProps) => {
    const {mutate: sendChatMessage, isLoading} = useMutation({
        mutationFn,
        onSuccess: () => setText(""),
    });
    const [text, setText] = React.useState("");
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && text.trim().length > 0) {
            sendChatMessage({chatRoomId, text: text.trim()});
        }
    };
    return (
        <div
            className={
                "absolute inset-x-0 bottom-0 isolate mx-auto w-full max-w-2xl px-8"
            }
        >
            <span
                className={
                    "absolute -z-10 h-full w-[calc(100%-4rem)] rounded-lg bg-white"
                }
                role={"decoration"}
            />
            <input
                aria-label={"type a chat message"}
                className={"mb-4 block w-full rounded-lg bg-black/5 p-2"}
                disabled={isLoading}
                placeholder={"Type a chat message"}
                value={text}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </div>
    );
};
