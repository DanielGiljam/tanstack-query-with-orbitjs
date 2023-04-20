import autoAnimate from "@formkit/auto-animate";
import {useIntersection} from "@mantine/hooks";
import {
    GetNextPageParamFunction,
    InfiniteData,
    QueryFunction,
    useInfiniteQuery,
} from "@tanstack/react-query";
import React from "react";

import {ChatMessageWithSender as TChatMessage} from "../types";

import {ChatMessageListItem} from "./ChatMessageListItem";
import {LoadingIndicator} from "./LoadingIndicator";

const queryFn: QueryFunction<
    TChatMessage[],
    ["chat-messages", string]
> = async (ctx) => {
    const res = await fetch(
        `/api/chat-room/${ctx.queryKey[1]}/chat-messages?count=${10}&offset=${
            (ctx.pageParam ?? 0) * 10
        }`,
    );
    return await res.json();
};

const getNextPageParam: GetNextPageParamFunction<TChatMessage[]> = (
    lastPage,
    pages,
) => (lastPage.length === 0 ? undefined : pages.length);

// remove duplicate chat messages;
// occasionally the set of pages is inconsistent
// due to one page being fetched before a chat message arrived
// and another page being fetched after it arrived
const select = (data: InfiniteData<TChatMessage[]>) => {
    const chatMessages = [
        ...new Map(
            data.pages
                .flat()
                .map((chatMessage) => [chatMessage.id, chatMessage]),
        ).values(),
    ];
    const pages: TChatMessage[][] = [];
    let offset = 0;
    while (
        (data?.pages.length ?? 1) > pages.length &&
        offset < chatMessages.length
    ) {
        pages.push(chatMessages.slice(offset, (offset += 10)));
    }
    return {
        pages,
        pageParams: chatMessages.map((_chatMessage, index) => index),
    };
};

interface ChatMessageListProps {
    chatRoomId: string;
}

export const ChatMessageList = ({chatRoomId}: ChatMessageListProps) => {
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage} =
        useInfiniteQuery({
            queryKey: ["chat-messages", chatRoomId],
            queryFn,
            getNextPageParam,
            select,
        });
    const listRef = React.useRef<HTMLUListElement>(null);
    const {ref: loadingIndicatorRef, entry} = useIntersection({
        root: listRef.current,
    });
    React.useEffect(() => {
        if (listRef.current != null) {
            autoAnimate(listRef.current);
        }
    }, []);
    React.useEffect(() => {
        console.log("ChatMessageList useEffect", entry?.isIntersecting);
        if (entry?.isIntersecting) {
            fetchNextPage().catch((error) => console.error(error));
        }
    }, [entry, fetchNextPage]);
    return (
        <ul
            ref={listRef}
            className={
                "mx-auto flex h-full w-full flex-grow flex-col-reverse overflow-y-auto px-8 pb-[4.5rem] pt-2"
            }
        >
            {data?.pages.flat().map((chatMessage) => (
                <ChatMessageListItem
                    key={chatMessage.id}
                    chatMessage={chatMessage}
                />
            ))}

            <li
                key={data?.pages.length ?? 0}
                className={
                    "mx-auto flex h-12 w-full shrink-0 justify-center p-2"
                }
            >
                {hasNextPage !== false && (
                    <LoadingIndicator
                        ref={
                            !isFetchingNextPage
                                ? loadingIndicatorRef
                                : undefined
                        }
                    />
                )}
            </li>
        </ul>
    );
};
