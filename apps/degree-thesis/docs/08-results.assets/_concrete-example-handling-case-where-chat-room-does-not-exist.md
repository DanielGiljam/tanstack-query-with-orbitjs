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

That was quite a lot of code just for keeping UI up-to-date in this specific case. But it doesn't end there. If you're experienced with Tanstack Query, you might know there are still more scenarios that need to be taken into account for the app to always work as expected.
