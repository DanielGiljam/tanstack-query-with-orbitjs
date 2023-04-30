import {InitializedRecord} from "@orbit/records";

export interface UserRecord extends InitializedRecord {
    type: "user";
    attributes: {
        name: string;
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
