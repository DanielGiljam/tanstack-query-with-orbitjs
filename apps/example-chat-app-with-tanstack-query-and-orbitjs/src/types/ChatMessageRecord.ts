import {InitializedRecord} from "@orbit/records";

export interface ChatMessageRecord extends InitializedRecord {
    type: "chatMessage";
    attributes: {
        text: string;
        createdAt: Date;
    };
    relationships: {
        sender: {
            data: {
                type: "user";
                id: string;
            };
        };
        chatRoom: {
            data: {
                type: "chatRoom";
                id: string;
            };
        };
    };
}
