Alright, now we have a sort of working chat application. "Sort of", because, while it fetches chat messages from the server, renders them, and lets you send new messages, it doesn't update the UI when new messages arrive or even when you send new messages, which is something you'd expect from a chat application.

No problem, we can implement that it updates the UI when new messages arrive and when you send new messages fairly easily.

In the `App` component, we can add a `useEffect` hook that subscribes to a WebSocket connection that receives a message whenever there is a new chat message. Then, using the [`QueryClient`](https://tanstack.com/query/latest/docs/reference/QueryClient), we can [invalidate the queries](https://tanstack.com/query/latest/docs/guides/query-invalidation), causing the queries to be refetched and the UI to be updated.

```tsx title="src/components/App.tsx"
export const App = () => {
    // highlight-add-start
    const queryClient = useQueryClient();
    // highlight-add-end
    const [
        selectedChatRoomId,
        setSelectedChatRoomId,
    ] = React.useState<string | null>(null);
    // highlight-add-start
    React.useEffect(() => {
        const socket = getSocket();
        socket.on("new-chat-message", () => {
            void queryClient.invalidateQueries();
        })
        return () => socket.disconnect();
    }, [queryClient]);
    // highlight-add-end
    return (
        <div>
            <ChatRoomList
                selectedChatRoomId={selectedChatRoomId}
                setSelectedChatRoomId={setSelectedChatRoomId}
            />
            <ChatRoom chatRoomId={selectedChatRoomId} />
        <div/>
    );
};
```

However, this is very inefficient. We're basically telling the app to redo all the API requests that it has done so far, which is a lot of unnecessary work. Instead, we should only invalidate the queries that are affected by the new chat message. That is:

-   The `["chat-messages"]` query for the chat room that the new message arrived in.
-   The `["chat-rooms"]` query, because the chat rooms are sorted according to when the latest message arrived in the room, and a preview of the latest message is shown in the chat room list item.

Let's assume the new chat message is included in the socket message, so we can grab the information about the chat room that the new message arrived in from the socket message.

```ts
socket.on("new-chat-message", (chatMessage: ChatMessage) => {
    void queryClient.invalidateQuery(["chat-messages", chatMessage.chatRoomId]);
    void queryClient.invalidateQuery(["chat-rooms"]);
});
```

Frankly, this is still pretty inefficient. We get the new chat message in the socket message, so basically we wouldn't need to redo any API requests at all.

We can use [`QueryClient#setQueryData`](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientsetquerydata) to manually update the queries' cached data and avoid doing any network requests.

```ts
socket.on("new-chat-message", (chatMessage: ChatMessage) => {
    queryClient.setQueryData(
        ["chat-messages", chatMessage.chatRoomId],
        (data) => [
            chatMessage,
            ...(data ?? []), // data might be undefined if the query doesn't exist from before
        ],
    );
    queryClient.setQueryData(["chat-rooms"], (data) => {
        // data might be undefined if the query doesn't exist from before
        if (data == null) {
            return;
        }
        // make a copy of the array which we are allowed to mutate
        const newData = [...data];
        const chatRoomIndex = newData.findIndex(
            (chatRoom) => chatRoom.id === chatMessage.chatRoomId,
        );
        // remove the chat room from the array
        const [chatRoom] = newData.splice(chatRoomIndex, 1);
        // prepend the a clone of chat room object to the array
        // where latestChatMessage is set to the new chat message
        newData.unshift({
            ...chatRoom,
            latestChatMessage: chatMessage,
        });
        return newData;
    });
});
```

If you have keen eyes, you may have noticed a problem with the code above. We're not accounting for the case that the chat room doesn't exist in the `["chat-rooms"]` query's cached data. The chat app doesn't fetch all the chat rooms when it mounts, only the 10 first.

A real chat app would probably implement something like pagination in the backend and infinite scrolling in the frontend, to allow the user to view rooms past the 10 first. But still, even though in a real chat app, more than 10 chat rooms may exist in cache, we cannot assume that it's _all_ chat rooms.

There are several ways we can address this. Ignoring the case where the chat room doesn't exist in the `["chat-rooms"]` query's cached data isn't one of those ways. Even if the new chat message belongs to a room which wasn't among the 10 first rooms, that room is now among the 10 first rooms, since the order of the rooms is determined by when chat messages last arrived in them.

In our example app, we can revert to calling `queryClient.invalidateQuery(["chat-rooms"])`, and it won't do much harm. Arguably, the added complexity of still manually trying updating the cached data isn't worth it in this case.

But for real chat apps that implement pagination, the situation is arguably different. Because now we're talking about potentially refetching hundreds of chat rooms just because one chat room got a new message.
