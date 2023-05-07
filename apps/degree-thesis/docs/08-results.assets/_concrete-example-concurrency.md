The [`onNewChatMessage` function](#on-new-chat-message-function) does not
take into consideration if any of the queries whose cached data it's
modifying are currently in-flight. This could affect the outcome in
different unwanted ways.

To dodge this potential bullet, the query which the function is
currently operating on must be cancelled if it's currently in-flight. It
can be done by using
[`QueryClient#cancelQueries`](https://tanstack.com/query/v4/docs/reference/QueryClient#queryclientcancelqueries).
Then after doing the synchronous query cache update, if the query was
being fetched prior to the update, the function must call
[`QueryClient#refetchQueries`](https://tanstack.com/query/v4/docs/reference/QueryClient#queryclientrefetchqueries)
to make sure that whatever was being fetched prior to the update still
gets fetched in the end.

```ts title="src/socket-message-handler/onNewChatMessage.ts"
export const onNewChatMessage = async (
    queryClient: QueryClient,
    chatMessage: ChatMessage,
) => {
    // highlight-add-start
    const wasFetchingChatMessages =
        queryClient.isFetching(["chat-messages", chatMessage.chatRoomId]) > 0;
    if (wasFetchingChatMessages) {
        await queryClient.cancelQueries([
            "chat-messages",
            chatMessage.chatRoomId,
        ]);
    }
    // highlight-add-end
    queryClient.setQueryData(
        ["chat-messages", chatMessage.chatRoomId],
        (data) => [
            chatMessage,
            ...(data ?? []), // data might be undefined if the query doesn't exist from before
        ],
    );
    // highlight-add-start
    if (wasFetchingChatMessages) {
        void queryClient.refetchQueries([
            "chat-messages",
            chatMessage.chatRoomId,
        ]);
    }
    const wasFetchingChatRooms = queryClient.isFetching(["chat-rooms"]) > 0;
    if (wasFetchingChatRooms) {
        await queryClient.cancelQueries(["chat-rooms"]);
    }
    // highlight-add-end
    const data = queryClient.getQueryData(["chat-rooms"]);
    // make a copy of the array which we are allowed to mutate
    const newData = [...(data ?? [])];
    const chatRoomIndex = newData.findIndex(
        (chatRoom) => chatRoom.id === chatMessage.chatRoomId,
    );
    let chatRoom: ChatRoom;
    // if chat room doesn't exist, fetch it
    if (chatRoomIndex === -1) {
        try {
            chatRoom = await fetchChatRoom(chatMessage.chatRoomId);
        } catch {
            // if fetching the chat room fails, we surrender (for now)
            return;
        }
    }
    // else remove it from the array
    else {
        const staleChatRoom = newData.splice(chatRoomIndex, 1)[0];
        chatRoom = {
            ...staleChatRoom,
            latestChatMessage: chatMessage,
        };
    }
    // prepend chat room to the array
    newData.unshift(chatRoom);
    queryClient.setQueryData(["chat-rooms"], newData);
    // highlight-add-start
    if (wasFetchingChatMessages) {
        void queryClient.refetchQueries(["chat-rooms"]);
    }
    // highlight-add-end
};
```

Since `fetchChatRoom` is asynchronous, by the time it's finished, the
cached data for the `["chat-rooms"]` query might already have changed
and differ from what's in `newData`.

```ts title="src/socket-message-handler/onNewChatMessage.ts"
export const onNewChatMessage = async (
    queryClient: QueryClient,
    chatMessage: ChatMessage,
) => {
    const wasFetchingChatMessages =
        queryClient.isFetching(["chat-messages", chatMessage.chatRoomId]) > 0;
    if (wasFetchingChatMessages) {
        await queryClient.cancelQueries([
            "chat-messages",
            chatMessage.chatRoomId,
        ]);
    }
    queryClient.setQueryData(
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
    // highlight-remove-start
    const data = queryClient.getQueryData(["chat-rooms"]);
    // make a copy of the array which we are allowed to mutate
    const newData = [...(data ?? [])];
    const chatRoomIndex = newData.findIndex(
        (chatRoom) => chatRoom.id === chatMessage.chatRoomId,
    );
    // highlight-remove-end
    // highlight-add-start
    let data = queryClient.getQueryData(["chat-rooms"]);
    // make a copy of the array which we are allowed to mutate
    let newData = [...(data ?? [])];
    let chatRoomIndex = newData.findIndex(
        (chatRoom) => chatRoom.id === chatMessage.chatRoomId,
    );
    // highlight-add-end
    let chatRoom: ChatRoom;
    // if chat room doesn't exist, fetch it
    if (chatRoomIndex === -1) {
        try {
            // highlight-add-start
            // synchronous handling of socket message ends here
            // highlight-add-end
            chatRoom = await fetchChatRoom(chatMessage.chatRoomId);
        } catch {
            // if fetching the chat room fails, we surrender (for now)
            return;
        }
        // highlight-add-start
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
        // highlight-add-end
    }
    // else remove it from the array
    else {
        const staleChatRoom = newData.splice(chatRoomIndex, 1)[0];
        chatRoom = {
            ...staleChatRoom,
            latestChatMessage: chatMessage,
        };
        // highlight-add-start
        // prepend chat room to the array
        newData.unshift(chatRoom);
        // highlight-add-end
    }
    // highlight-remove-start
    // prepend chat room to the array
    newData.unshift(chatRoom);
    // highlight-remove-end
    queryClient.setQueryData(["chat-rooms"], newData);
    if (wasFetchingChatMessages) {
        void queryClient.refetchQueries(["chat-rooms"]);
    }
};
```

Now that concurrency has been taken into consideration, this particular
query cache updater is finished.
