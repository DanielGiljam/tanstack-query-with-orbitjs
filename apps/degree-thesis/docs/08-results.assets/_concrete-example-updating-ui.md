You now have a chat application that works to a certain extent but is
limited in its functionality in that it doesn't update the UI when new
chat messages arrive or when the user sends new chat messages, which is
something users have come to expect from modern day chat applications.

Updating the UI when new chat messages arrive can be implemented fairly
easily.

In the App component, a [useEffect
hook](https://react.dev/reference/react/useEffect) can be added that
subscribes to a
[`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
connection that receives a message whenever there is a new chat message.
Then, using the
[`QueryClient`](https://tanstack.com/query/v4/docs/reference/QueryClient),
we can [invalidate the
queries](https://tanstack.com/query/v4/docs/guides/query-invalidation),
causing the queries to be re-fetched and the UI to be updated.

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

However, this is very inefficient. Calling
[`QueryClient#invalidateQueries`](https://tanstack.com/query/v4/docs/reference/QueryClient#queryclientinvalidatequeries)
is effectively causing the app to redo all the API requests that it has
done so far, which is a lot of unnecessary work.

A better alternative would be to only invalidate the queries that are
affected by the new chat message. That is:

-   The `["chat-messages"]` query for the chat room that the new
    message arrived in.

-   The `["chat-rooms"]` query, because the chat rooms are sorted
    according to when the latest message arrived in the room, and a
    preview of the latest message is shown in the chat room list item.

Let's assume that the new chat message is included in the socket
message, so the information about the chat room that the new message
arrived in can be retrieved from the socket message.

```ts
socket.on("new-chat-message", (chatMessage: ChatMessage) => {
    void queryClient.invalidateQuery(["chat-messages", chatMessage.chatRoomId]);
    void queryClient.invalidateQuery(["chat-rooms"]);
});
```

Frankly, this is still inefficient. As the new chat message in included
in the socket message, in most cases, all the information necessary is
already present in the app's memory in some shape or another, and there
is theoretically no need to make any additional API requests.

"In most cases", because no assumption was made that the chat room
itself would be included in the socket message, and in case it doesn't
exist in cache from before, it would have to be fetched separately
before the update can be applied.

[`QueryClient#setQueryData`](https://tanstack.com/query/v4/docs/reference/QueryClient#queryclientsetquerydata)
can be used to manually update the queries' cached data and avoid doing
any network requests.

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

As hinted earlier in the text, this only works in most cases. The case
where the chat room doesn't exist in the `["chat-rooms"]` query's
cached data is not accounted for. It cannot be assumed that the
`["chat-rooms"]` query's cached data contains all chat rooms. In the
[example implementation of the `ChatRoomList` component](#chat-room-list-component)
the `["chat-rooms"]` query's cached data will contain the 10 most
recently active chat rooms if the query resolved successfully.

In the real implementation which can be found in the [GitHub
repository](https://github.com/DanielGiljam/tanstack-query-with-orbitjs)
and which meets the requirements listed in [_Methods: Implementation:
Developing an example application_](methods#developing-an-example-application),
"infinite scrolling" has been implemented, which allows the user to view
rooms past the 10 first. But even though more than 10 chat rooms may
exist in cache, we cannot assume that it's all chat rooms.

There are several ways to address this. Ignoring the case where the chat
room doesn't exist in the `["chat-rooms"]` query's cached data isn't
one of those ways. Even if the new chat message belongs to a room which
wasn't among the 10 first rooms, that room is now among the 10 first
rooms, since the order of the rooms is determined by when chat messages
last arrived in them.

In the example app, reverting to calling
`queryClient.invalidateQuery(["chat-rooms"])` won't do much harm.
Arguably, the added complexity of manually trying to update the cached
data isn't worth it in this case.

But for real chat apps that implement pagination, the situation is
arguably different. It might then be a question of potentially
re-fetching hundreds of chat rooms just because one chat room got a new
message.
