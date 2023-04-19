import {QueryClient} from "@tanstack/react-query";

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
    if (wasFetchingChatMessages) {
        await queryClient.cancelQueries([
            "chat-messages",
            chatMessage.chatRoomId,
        ]);
    }
    queryClient.setQueryData<TChatMessage[]>(
        ["chat-messages", chatMessage.chatRoomId],
        (data) => [
            chatMessage,
            ...(data ?? []), // data might be undefined if the query doesn't exist from before
        ],
    );
    if (wasFetchingChatMessages) {
        void queryClient.refetchQueries([
            "chat-messages",
            chatMessage.chatRoomId,
        ]);
    }
    let wasFetchingChatRooms = queryClient.isFetching(["chat-rooms"]) > 0;
    if (wasFetchingChatRooms) {
        await queryClient.cancelQueries(["chat-rooms"]);
    }
    let data = queryClient.getQueryData<TChatRoom[]>(["chat-rooms"]);
    // make a copy of the array which we are allowed to mutate
    let newData = [...(data ?? [])];
    let chatRoomIndex = newData.findIndex(
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
        if (wasFetchingChatRooms) {
            await queryClient.cancelQueries(["chat-rooms"]);
        }
        data = queryClient.getQueryData(["chat-rooms"]);
        newData = [...(data ?? [])];
        chatRoomIndex = newData.findIndex(
            (chatRoom) => chatRoom.id === chatMessage.chatRoomId,
        );
        if (chatRoomIndex !== -1) {
            // we can assume that the chat room we just fetched
            // is as up-to-date or more up-to-date than the one
            // that was added to the cache while we were fetching
            newData[chatRoomIndex] = chatRoom;
        } else {
            // prepend chat room to the array
            newData.unshift(chatRoom);
        }
        // we cannot assume that the chat room we just fetched
        // should still go to the top of the list
        newData.sort(latestChatMessageCreatedAtDescendingCompareFn);
    }
    // else remove it from the array
    else {
        const staleChatRoom = newData.splice(chatRoomIndex, 1)[0];
        chatRoom = {
            ...staleChatRoom,
            latestChatMessage: chatMessage,
        };
        // prepend chat room to the array
        newData.unshift(chatRoom);
    }
    queryClient.setQueryData(["chat-rooms"], newData);
    if (wasFetchingChatMessages) {
        void queryClient.refetchQueries(["chat-rooms"]);
    }
};
