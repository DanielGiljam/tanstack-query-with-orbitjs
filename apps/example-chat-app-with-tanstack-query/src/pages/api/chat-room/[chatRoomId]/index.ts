import {NextApiRequest, NextApiResponse} from "next";

import {prisma} from "../../../../prisma";
import {idSchema} from "../../../../server";

export const chatRoom = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.status(405).json({statusMessage: "Method not allowed"});
        return;
    }
    const idParseResult = idSchema.safeParse(req.query.chatRoomId);
    if (!idParseResult.success) {
        res.status(404).json({statusMessage: "Not found"});
        return;
    }
    const chatRoomId = idParseResult.data;
    let chatRoomWithLatestChatMessage;
    try {
        const {
            chatRoomId: _chatRoomId,
            chatRoom,
            ...latestChatMessage
        } = await prisma.chatMessage.findFirstOrThrow({
            where: {chatRoomId},
            orderBy: {createdAt: "desc"},
            include: {chatRoom: true, sender: true},
        });
        chatRoomWithLatestChatMessage = {
            ...chatRoom,
            latestChatMessageId: latestChatMessage.id,
            latestChatMessage,
        };
    } catch {
        res.status(404).json({statusMessage: "Not found"});
    }
    res.status(200).json(chatRoomWithLatestChatMessage);
};

export default chatRoom;
