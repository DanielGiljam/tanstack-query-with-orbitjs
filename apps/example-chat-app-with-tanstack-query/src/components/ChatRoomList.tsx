import autoAnimate from "@formkit/auto-animate";
import {useIntersection} from "@mantine/hooks";
import {
    GetNextPageParamFunction,
    InfiniteData,
    QueryFunction,
    useInfiniteQuery,
} from "@tanstack/react-query";
import React from "react";

import {ChatRoomWithLatestChatMessage as TChatRoom} from "../types";

import {ChatRoomListItem} from "./ChatRoomListItem";
import {LoadingIndicator} from "./LoadingIndicator";

const queryFn: QueryFunction<TChatRoom[]> = async (ctx) => {
    const res = await fetch(
        `/api/chat-rooms?count=${10}&offset=${(ctx.pageParam ?? 0) * 10}`,
    );
    return await res.json();
};

const getNextPageParam: GetNextPageParamFunction<TChatRoom[]> = (
    lastPage,
    pages,
) => (lastPage.length === 0 ? undefined : pages.length);

// remove duplicate chat rooms;
// occasionally the set of pages is inconsistent
// due to one page being fetched before a chat room arrived
// and another page being fetched after it arrived
const select = (data: InfiniteData<TChatRoom[]>) => {
    const chatRooms = [
        ...new Map(
            data.pages.flat().map((chatRoom) => [chatRoom.id, chatRoom]),
        ).values(),
    ];
    const pages: TChatRoom[][] = [];
    let offset = 0;
    while (
        (data?.pages.length ?? 1) > pages.length &&
        offset < chatRooms.length
    ) {
        pages.push(chatRooms.slice(offset, (offset += 10)));
    }
    return {
        pages,
        pageParams: chatRooms.map((_chatMessage, index) => index),
    };
};

interface ChatRoomListProps {
    selectedChatRoom: TChatRoom | null;
    setSelectedChatRoom: React.Dispatch<React.SetStateAction<TChatRoom | null>>;
}

export const ChatRoomList = ({
    selectedChatRoom,
    setSelectedChatRoom,
}: ChatRoomListProps) => {
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage} =
        useInfiniteQuery({
            queryKey: ["chat-rooms"],
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
        console.log("ChatRoomList useEffect", entry?.isIntersecting);
        if (entry?.isIntersecting) {
            fetchNextPage().catch((error) => console.error(error));
        }
    }, [entry, fetchNextPage]);
    return (
        <ul ref={listRef} className={"w-[240px] flex-grow overflow-y-auto"}>
            {data?.pages.flat().map((chatRoom) => (
                <ChatRoomListItem
                    key={chatRoom.id}
                    chatRoom={chatRoom}
                    selected={chatRoom.id === selectedChatRoom?.id}
                    onClick={() => setSelectedChatRoom(chatRoom)}
                />
            ))}
            <li
                key={data?.pages.length ?? 0}
                className={"flex h-12 w-full shrink-0 justify-center p-2"}
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
