import MemorySource from "@orbit/memory";
import {
    RecordOperationTerm,
    RecordQuery,
    RecordTransformBuilder,
} from "@orbit/records";

import {ChatMessageWithSender, ChatRoomWithLatestChatMessage} from "../types";

const remoteDataTransformers = {
    ChatRoomTransformer: (
        tb: RecordTransformBuilder,
        chatRoom: ChatRoomWithLatestChatMessage,
    ) => [
        tb.updateRecord({
            type: "user",
            id: chatRoom.latestChatMessage.sender.id,
            attributes: {
                name: chatRoom.latestChatMessage.sender.name,
            },
        }),
        tb.updateRecord({
            type: "chatMessage",
            id: chatRoom.latestChatMessage.id,
            attributes: {
                text: chatRoom.latestChatMessage.text,
                createdAt: new Date(chatRoom.latestChatMessage.createdAt),
            },
            relationships: {
                sender: {
                    data: {
                        type: "user",
                        id: chatRoom.latestChatMessage.sender.id,
                    },
                },
            },
        }),
        tb.updateRecord({
            type: "chatRoom",
            id: chatRoom.id,
            attributes: {
                name: chatRoom.name,
                latestChatMessageCreatedAt: new Date(
                    chatRoom.latestChatMessage.createdAt,
                ),
            },
            relationships: {
                chatMessages: {
                    data: [
                        {
                            type: "chatMessage",
                            id: chatRoom.latestChatMessage.id,
                        },
                    ],
                },
            },
        }),
    ],
    ChatRoomsTransformer: (
        tb: RecordTransformBuilder,
        chatRooms: ChatRoomWithLatestChatMessage[],
    ) => {
        const operationTerms: RecordOperationTerm[] = [];
        for (const chatRoom of chatRooms) {
            operationTerms.push(
                tb.updateRecord({
                    type: "user",
                    id: chatRoom.latestChatMessage.sender.id,
                    attributes: {
                        name: chatRoom.latestChatMessage.sender.name,
                    },
                }),
                tb.updateRecord({
                    type: "chatMessage",
                    id: chatRoom.latestChatMessage.id,
                    attributes: {
                        text: chatRoom.latestChatMessage.text,
                        createdAt: new Date(
                            chatRoom.latestChatMessage.createdAt,
                        ),
                    },
                    relationships: {
                        sender: {
                            data: {
                                type: "user",
                                id: chatRoom.latestChatMessage.sender.id,
                            },
                        },
                    },
                }),
                tb.updateRecord({
                    type: "chatRoom",
                    id: chatRoom.id,
                    attributes: {
                        name: chatRoom.name,
                        latestChatMessageCreatedAt: new Date(
                            chatRoom.latestChatMessage.createdAt,
                        ),
                    },
                    relationships: {
                        chatMessages: {
                            data: [
                                {
                                    type: "chatMessage",
                                    id: chatRoom.latestChatMessage.id,
                                },
                            ],
                        },
                    },
                }),
            );
        }
        return operationTerms;
    },
    ChatMessagesTransformer: (
        tb: RecordTransformBuilder,
        chatMessages: ChatMessageWithSender[],
    ) => {
        const operationTerms: RecordOperationTerm[] = [];
        for (const chatMessage of chatMessages) {
            operationTerms.push(
                tb.updateRecord({
                    type: "user",
                    id: chatMessage.sender.id,
                    attributes: {
                        name: chatMessage.sender.name,
                    },
                }),
                tb.updateRecord({
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
                }),
            );
        }
        return operationTerms;
    },
} as const;

type RemoteDataTransformerKey = keyof typeof remoteDataTransformers;

const fetchPromises = new Map<string, Promise<void>>();

const memoryOnBeforeQuery = async (
    memorySource: MemorySource,
    query: RecordQuery,
) => {
    for (const expression of Array.isArray(query.expressions)
        ? query.expressions
        : [query.expressions]) {
        const remotePath = expression.options?.remotePath as string | undefined;
        const remoteDataTransformerKey = expression.options
            ?.remoteDataTransformer as RemoteDataTransformerKey | undefined;
        if (remotePath != null && remoteDataTransformerKey != null) {
            const fetchOnlyIfNotInCache = expression.options!
                .fetchOnlyIfNotInCache as boolean | undefined;
            if (
                fetchOnlyIfNotInCache === true &&
                memorySource.cache.query(expression) != null
            ) {
                continue;
            }
            let fetchPromise = fetchPromises.get(remotePath);
            if (fetchPromise == null) {
                fetchPromise = fetch(remotePath).then(async (res) => {
                    const data = await res.json();
                    await memorySource.sync((tb) =>
                        remoteDataTransformers[remoteDataTransformerKey](
                            tb,
                            data,
                        ),
                    );
                });
                fetchPromises.set(remotePath, fetchPromise);
            }
            await fetchPromise;
        }
    }
};

export const addSimpleMemoryRemoteRequestStrategy = (
    memorySource: MemorySource,
) => {
    memorySource.on("beforeQuery", async (query: RecordQuery) => {
        await memoryOnBeforeQuery(memorySource, query);
    });
};
