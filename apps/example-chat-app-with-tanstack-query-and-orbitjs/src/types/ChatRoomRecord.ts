import {InitializedRecord} from "@orbit/records";

export interface ChatRoomRecord extends InitializedRecord {
    type: "chatRoom";
    attributes: {
        name: string;
        latestChatMessageCreatedAt: Date;
    };
    relationships: {
        chatMessages: {
            data: Array<{
                type: "chatMessage";
                id: string;
            }>;
        };
    };
}
