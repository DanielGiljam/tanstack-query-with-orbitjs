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

For the sake of brevity, only the most relevant source code for this example is shown. For the full source code, see the [GitHub repository](https://github.com/DanielGiljam/tanstack-query-with-orbitjs/tree/main/apps/example-chat-app-with-tanstack-query).

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
