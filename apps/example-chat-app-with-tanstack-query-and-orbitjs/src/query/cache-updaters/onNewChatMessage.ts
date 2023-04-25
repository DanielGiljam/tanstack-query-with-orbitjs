import {InfiniteData, QueryClient} from "@tanstack/react-query";

import {
    ChatMessageWithSender as TChatMessage,
    ChatRoomWithLatestChatMessage as TChatRoom,
} from "../../types";

const fetchChatRoom = async (chatRoomId: string) => {
    const res = await fetch("/api/chat-room/" + chatRoomId);
    return (await res.json()) as TChatRoom;
};

const latestChatMessageCreatedAtDescendingCompareFn = (
    a: TChatRoom,
    b: TChatRoom,
) =>
    new Date(b.latestChatMessage.createdAt).valueOf() -
    new Date(a.latestChatMessage.createdAt).valueOf();

export const onNewChatMessage = async (
    queryClient: QueryClient,
    chatMessage: TChatMessage,
) => {
    console.log("onNewChatMessage", chatMessage);
    const wasFetchingChatMessages =
        queryClient.isFetching(["chat-messages", chatMessage.chatRoomId]) > 0;
    const wasFetchingNextPageOfChatMessages =
        wasFetchingChatMessages &&
        queryClient.getQueryState(["chat-messages", chatMessage.chatRoomId])!
            .fetchMeta?.fetchMore?.direction === "forward";
    if (wasFetchingChatMessages) {
        await queryClient.cancelQueries([
            "chat-messages",
            chatMessage.chatRoomId,
        ]);
    }
    queryClient.setQueryData<InfiniteData<TChatMessage[]>>(
        ["chat-messages", chatMessage.chatRoomId],
        (data) => {
            const chatMessages = data?.pages.flat() ?? [];
            chatMessages.unshift(chatMessage);
            // rebuild pages
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
                pageParams: pages.map((_record, index) => index),
            };
        },
    );
    // no need to refetch if it was fetching the next page of chat messages
    // in that case UI will trigger the fetching of the next page again if needed
    if (wasFetchingChatMessages && !wasFetchingNextPageOfChatMessages) {
        void queryClient.refetchQueries([
            "chat-messages",
            chatMessage.chatRoomId,
        ]);
    }
    let wasFetchingChatRooms = queryClient.isFetching(["chat-rooms"]) > 0;
    let wasFetchingNextPageOfChatRooms =
        wasFetchingChatRooms &&
        queryClient.getQueryState(["chat-rooms"])!.fetchMeta?.fetchMore
            ?.direction === "forward";
    if (wasFetchingChatRooms) {
        await queryClient.cancelQueries(["chat-rooms"]);
    }
    let data = queryClient.getQueryData<InfiniteData<TChatRoom[]>>([
        "chat-rooms",
    ]);
    // make a copy of the array which we are allowed to mutate
    let chatRooms = data?.pages.flat() ?? [];
    let chatRoomIndex = chatRooms.findIndex(
        (chatRoom) => chatRoom.id === chatMessage.chatRoomId,
    );
    let chatRoom: TChatRoom;
    // if chat room doesn't exist, fetch it
    if (chatRoomIndex === -1) {
        try {
            // synchronous handling of socket message ends here
            chatRoom = await fetchChatRoom(chatMessage.chatRoomId);
        } catch {
            // if fetching the chat room fails, we surrender (for now)
            return;
        }
        // we need to check for in-flight queries and cancel them again
        // since we "left" the synchronous execution context
        wasFetchingChatRooms = queryClient.isFetching(["chat-rooms"]) > 0;
        wasFetchingNextPageOfChatRooms =
            wasFetchingChatRooms &&
            queryClient.getQueryState(["chat-rooms"])!.fetchMeta?.fetchMore
                ?.direction === "forward";
        if (wasFetchingChatRooms) {
            await queryClient.cancelQueries(["chat-rooms"]);
        }
        data = queryClient.getQueryData(["chat-rooms"]);
        chatRooms = data?.pages.flat() ?? [];
        chatRoomIndex = chatRooms.findIndex(
            (chatRoom) => chatRoom.id === chatMessage.chatRoomId,
        );
        if (chatRoomIndex !== -1) {
            // we can assume that the chat room we just fetched
            // is as up-to-date or more up-to-date than the one
            // that was added to the cache while we were fetching
            chatRooms[chatRoomIndex] = chatRoom;
        } else {
            // prepend chat room to the array
            chatRooms.unshift(chatRoom);
        }
        // we cannot assume that the chat room we just fetched
        // should still go to the top of the list
        chatRooms.sort(latestChatMessageCreatedAtDescendingCompareFn);
    }
    // else remove it from the array
    else {
        const staleChatRoom = chatRooms.splice(chatRoomIndex, 1)[0];
        chatRoom = {
            ...staleChatRoom,
            latestChatMessage: chatMessage,
        };
        // prepend chat room to the array
        chatRooms.unshift(chatRoom);
    }
    // rebuild pages
    const pages: TChatRoom[][] = [];
    let offset = 0;
    while (
        (data?.pages.length ?? 1) > pages.length &&
        offset < chatRooms.length
    ) {
        pages.push(chatRooms.slice(offset, (offset += 10)));
    }
    const newData = {
        pages,
        pageParams: pages.map((_record, index) => index),
    };
    queryClient.setQueryData(["chat-rooms"], newData);
    // no need to refetch if it was fetching the next page of chat rooms
    // in that case UI will trigger the fetching of the next page again if needed
    if (wasFetchingChatRooms && !wasFetchingNextPageOfChatRooms) {
        void queryClient.refetchQueries(["chat-rooms"]);
    }
};
