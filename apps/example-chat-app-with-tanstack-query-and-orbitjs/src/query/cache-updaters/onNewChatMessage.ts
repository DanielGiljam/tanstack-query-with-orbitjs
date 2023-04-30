import {RecordOperationTerm} from "@orbit/records";
import {LiveQueryClient} from "@tanstack-query-with-orbitjs/react";

import {ChatMessageWithSender, ChatRoomRecord} from "../../types";

export const onNewChatMessage = async (
    queryClient: LiveQueryClient,
    chatMessage: ChatMessageWithSender,
) => {
    console.log("onNewChatMessage", chatMessage);
    // get a reference to the memory source
    const memorySource = queryClient.getMemorySourceIfActivated();
    // ignore new chat message if the memory source isn't activated
    // (means app hasn't really loaded yet, an initial fetches have not been triggered either)
    if (memorySource == null) {
        return;
    }
    // get a reference to the transform builder
    const transformBuilder = memorySource.transformBuilder;
    // initialize an array of operation terms
    const operationTerms: RecordOperationTerm[] = [];
    // add the user record for the sender of the new chat message,
    // in case that user record doesn't exist in cache from before
    // (`updateRecord` so it doesn't throw if the record did exist in cache)
    operationTerms.push(
        transformBuilder.updateRecord({
            type: "user",
            id: chatMessage.sender.id,
            attributes: {name: chatMessage.sender.name},
        }),
    );
    // prepare chat message record
    const newChatMessageRecord = {
        type: "chatMessage",
        id: chatMessage.id,
        attributes: {
            text: chatMessage.text,
            createdAt: new Date(chatMessage.createdAt),
        },
        relationships: {
            sender: {
                data: {
                    type: "user",
                    id: chatMessage.senderId,
                },
            },
            chatRoom: {
                data: {
                    type: "chatRoom",
                    id: chatMessage.chatRoomId,
                },
            },
        },
    };
    // get the chat room from cache, fetch only if it's not in cache
    const chatRoom = await memorySource.query<ChatRoomRecord>((qb) =>
        qb.findRecord({type: "chatRoom", id: chatMessage.chatRoomId}).options({
            fetchOnlyIfNotInCache: true,
            remoteDataTransformer: "ChatRoomTransformer",
            remotePath: `/api/chat-room/${chatMessage.chatRoomId}`,
        }),
    );
    // if the chat room was returned from cache, we must update its
    // latestChatMessageCreatedAt attribute
    if (
        chatRoom.attributes.latestChatMessageCreatedAt.valueOf() <
        newChatMessageRecord.attributes.createdAt.valueOf()
    ) {
        operationTerms.push(
            transformBuilder.replaceAttribute(
                {type: "chatRoom", id: chatRoom.id},
                "latestChatMessageCreatedAt",
                newChatMessageRecord.attributes.createdAt,
            ),
        );
    }
    // finally, add the chat message to cache along with its relationships
    // to the sender and the chat room
    operationTerms.push(transformBuilder.updateRecord(newChatMessageRecord));
    // apply the transform builder functions in the memory source's update method
    await memorySource.update(operationTerms);
};
