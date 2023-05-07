import {useIntersection} from "@mantine/hooks";
import {
    QueryMeta,
    useLiveInfiniteQuery,
} from "@tanstack-query-with-orbitjs/react";
import {GetNextPageParamFunction, InfiniteData} from "@tanstack/react-query";
import React from "react";

import {ChatRoomRecord as TChatRoom} from "../types";

import {ChatRoomListItem} from "./ChatRoomListItem";
import {LoadingIndicator} from "./LoadingIndicator";

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

const meta: QueryMeta = {
    getQueryOrExpressions: (qb, _queryKey, pageParam) => {
        const term = qb
            .findRecords("chatRoom")
            .sort("-latestChatMessageCreatedAt");
        // pageParam being nullish is a sign that
        // the function is being called to instantiate
        // the live query, in which case we DON'T want to
        // "paginate" the query
        if (pageParam == null) {
            return term;
        }
        return term.page({offset: pageParam * 10, limit: 10}).options({
            remoteDataTransformer: "ChatRoomsTransformer",
            remotePath: `/api/chat-rooms?count=${10}&offset=${
                (pageParam ?? 0) * 10
            }`,
        });
    },
    pageSize: 10,
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
        useLiveInfiniteQuery({
            queryKey: ["chat-rooms"],
            getNextPageParam,
            select,
            meta,
        });
    const listRef = React.useRef<HTMLUListElement>(null);
    const {ref: loadingIndicatorRef, entry} = useIntersection({
        root: listRef.current,
    });
    React.useEffect(() => {
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
