# When React Query falls short

I could start explaining how I think the [React Query][rq] pattern falls short, using fancy terms like

-   "scalability",
-   "code ergonomics",
-   and "maintainability"

but I think it's better if I instead, right off the bath, give a concrete example.

## Concrete example

Imagine, you're building a typical (current age) chat application. An application like

-   [Slack](https://slack.com/),
-   [Discord](https://discord.com/),
-   [Telegram](https://telegram.org/),
-   or [WhatsApp](https://whatsapp.com/).

The UI is expected to look something like this:

![typical chat application UI](when-react-query-falls-short.assets/typical-chat-app-ui.png)

On the left-hand side, you have a list of chat rooms. On the right-hand side, you have a list of messages in the currently selected chat room.

Now, imagine that you're building the UI for this application using the [React Query][rq] pattern.

### Initial code

You would probably start out by creating an `App` component that looks something like this:

```tsx title="src/components/App.tsx"
export const App = () => {
    const [
        selectedChatRoomId,
        setSelectedChatRoomId,
    ] = React.useState<string | null>(null);
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

:::note

For the sake of brevity, only the most relevant source code for this example is shown. For the full source code, see the [GitHub repository](https://github.com/DanielGiljam/offline-full-text-search-in-web-app/tree/main/apps/typical-chat-app-with-react-query).

:::

Then you would go on to implement the `ChatRoomList` component…

```tsx title="src/components/ChatRoomList.tsx"
const queryFn = async () => {
    const response = await fetch("/api/chat-rooms");
    return response.json();
};

export const ChatRoomList = ({
    selectedChatRoomId,
    setSelectedChatRoomId
}: ChatRoomListProps) => {
    const {data: chatRooms} = useQuery({
        queryKey: ["chat-rooms"],
        queryFn,
    });
    return (
        <ul>
            {chatRooms?.map((chatRoom) => (
                // Assumed stateless component,
                // implementation not of interest in this example
                <ChatRoomListItem
                    key={chatRoom.id}
                    chatRoom={chatRoom}
                    selected={chatRoom.id === selectedChatRoomId}
                    onClick={() => setSelectedChatRoomId(chatRoom.id)}
                />
            ))}
        <ul/>
    );
};
```

…and the `ChatRoom` component.

```tsx title="src/components/ChatRoom.tsx"
export const ChatRoom = ({chatRoomId}: ChatRoomProps) => {
    return (
        <div>
            <ChatMessageList chatRoomId={chatRoomId} />
            <ChatMessageInput chatRoomId={chatRoomId} />
        <div/>
    );
};
```

Now, we have two more components to implement.

The `ChatMessageList` component…

```tsx title="src/components/ChatMessageList.tsx"
const queryFn = async (ctx: QueryFunctionContext<["chat-messages", string]>) => {
    const response = await fetch(`/api/chat-room/${ctx.queryKey[1]}/chat-messages`);
    return response.json();
};

export const ChatMessageList = ({chatRoomId}: ChatMessageListProps) => {
    const {data: chatMessages} = useQuery({
        queryKey: ["chat-messages", chatRoomId],
        queryFn,
    });
    return (
        <ul>
            {chatMessages?.map((chatMessage) => (
                // Assumed stateless component,
                // implementation not of interest in this example
                <ChatMessageListItem
                    key={chatMessage.id}
                    chatMessage={chatMessage}
                />
            ))}
        <ul/>
    );
};
```

…and the `ChatMessageInput` component.

```tsx title="src/components/ChatMessageInput.tsx"
const mutationFn = async ({
    chatRoomId,
    text,
}: {
    chatRoomId: string;
    text: string;
}) => {
    const response = await fetch(`/api/chat-room/${chatRoomId}/chat-message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    });
    return response.json();
};

export const ChatMessageInput = ({chatRoomId}: ChatMessageInputProps) => {
    const [text, setText] = React.useState("");
    const {mutate: sendChatMessage, isLoading} = useMutation({
        mutationFn,
        onSuccess: () => setText(""),
    });
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendChatMessage({chatRoomId, text});
        }
    };
    return (
        <input
            value={text}
            disabled={isLoading}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
    );
};
```

### Updating UI when new chat messages arrive

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

#### Handling the case where the chat room doesn't exist in the `["chat-rooms"]` query's cached data

Easiest from our point of view as frontend developers is probably if the backend make a change to include chat room object as well as the chat message object in the socket message informing the client about a new chat message.

But the socket service adapting this way to accommodate to very specific frontend needs is a luxury which we cannot expect to have every time we run into a case like this. The socket service has performance and efficiency considerations of its own that it needs to care about, and bundling more data in the socket messages goes strictly against those considerations.

So we might as well accept that we need to be able to handle this in the frontend.

First step is to go asynchronous.

```ts
socket.on("new-chat-message", (chatMessage: ChatMessage) => {
    // highlight-remove-start
    queryClient.setQueryData(
        ["chat-messages", chatMessage.chatRoomId],
        ...
    );
    queryClient.setQueryData(["chat-rooms"], (data) => {
        ...
    });
    // highlight-remove-end
    // highlight-add-start
    void onNewChatMessage(queryClient, chatMessage);
    // highlight-add-end
});
```

Then, let's write the new asynchronous `onNewChatMessage` function.

```ts title="src/socket-message-handler/onNewChatMessage.ts"
export const onNewChatMessage = async (
    queryClient: QueryClient,
    chatMessage: ChatMessage,
) => {
    queryClient.setQueryData(
        ["chat-messages", chatMessage.chatRoomId],
        (data) => [
            chatMessage,
            ...(data ?? []), // data might be undefined if the query doesn't exist from before
        ],
    );
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
        const [staleChatRoom] = newData.splice(chatRoomIndex, 1)[0];
        chatRoom = {
            ...staleChatRoom,
            latestChatMessage: chatMessage,
        };
    }
    // prepend chat room to the array
    newData.unshift(chatRoom);
    queryClient.setQueryData(["chat-rooms"], newData);
};
```

That was quite a lot of code just for keeping UI up-to-date in this specific case. But it doesn't end there. If you're experienced with Tanstack Query, you might know there are still more scenarios that need to be taken into account for the app to always work as expected.

### Dealing with concurrency

The `onNewChatMessage` function we just wrote does not take into account if any of the queries which cached data we are operating on are currently in-flight. This could affect the outcome in different unwanted ways.

<!-- TODO: list ways in which it could affect the outcome in different unwanted ways -->

To dodge this potential bullet, we need to cancel the query we are currently operating on if it's currently in-flight. We can do this by using [`QueryClient#cancelQueries`](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientcancelqueries). Then after doing our synchronous query cache update, if the query was being fetched prior to our update, we should call [`QueryClient#refetchQueries`](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientrefetchqueries) to make sure that whatever was being fetched prior to our update still gets fetched in the end.

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
        const [staleChatRoom] = newData.splice(chatRoomIndex, 1)[0];
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

Since `fetchChatRoom` is asynchronous, by the time it's finished, the cached data for the `["chat-rooms"]` query might already have changed and differ from what's in `newData`.

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
        newData.sort(latestChatMessageCreatedAtCompareFn);
        // highlight-add-end
    }
    // else remove it from the array
    else {
        const [staleChatRoom] = newData.splice(chatRoomIndex, 1)[0];
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

Now that we've dealt with concurrency, we can call it a day for this particular query cache updater.

### Conclusion

The `onNewChatMessage` function was just one query cache updater. When our app grows, we'll be creating more of these updaters, and while the code can be organized into neat file structures and parts of it can be extracted into helper functions that can be reused across those files, there will no doubt still be a lot of query cache updating code to maintain.

In my opinion, this is where [React Query](rq) falls short.

<!-- TODO: write about description in Tanstack Query homepage and how it's partially true and Tanstack Query is an improvement over nothing and a good library but not good enough -->

[rq]: /#the-react-query-pattern
