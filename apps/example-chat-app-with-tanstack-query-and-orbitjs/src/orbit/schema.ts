import {RecordSchema} from "@orbit/records";

export const schema = new RecordSchema({
    models: {
        chatRoom: {
            attributes: {
                name: {type: "string"},
                latestChatMessageCreatedAt: {type: "datetime"},
            },
            relationships: {
                chatMessages: {
                    kind: "hasMany",
                    type: "chatMessage",
                    inverse: "chatRoom",
                },
            },
        },
        chatMessage: {
            attributes: {
                text: {type: "string"},
                createdAt: {type: "datetime"},
            },
            relationships: {
                sender: {
                    kind: "hasOne",
                    type: "user",
                    inverse: "chatMessages",
                },
                chatRoom: {
                    kind: "hasOne",
                    type: "chatRoom",
                    inverse: "chatMessages",
                },
            },
        },
        user: {
            attributes: {
                name: {type: "string"},
            },
            relationships: {
                chatMessages: {
                    kind: "hasMany",
                    type: "chatMessage",
                    inverse: "sender",
                },
            },
        },
    },
});
