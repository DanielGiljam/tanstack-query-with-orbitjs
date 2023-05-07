The easiest solution from the point of view of a frontend developer is
probably if the backend makes a change to include the chat room object
as well as the chat message object in the socket message which informs
the client about the new chat message.

But the socket service adapting this way to accommodate to very specific
frontend needs is a luxury which cannot be expected every time a case
like this is encountered. The socket service has performance and
efficiency considerations of its own that it needs to care about, and
bundling more data in the socket messages goes strictly against those
considerations.

So, as a frontend developer, you might as well accept that you need to
be able to handle this in the frontend.

The first step is to go asynchronous.

<div id="on-new-chat-message-function" style={{scrollMarginTop: "calc(var(--ifm-navbar-height) + 0.5rem)"}}>

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
        const staleChatRoom = newData.splice(chatRoomIndex, 1)[0];
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

</div>

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
