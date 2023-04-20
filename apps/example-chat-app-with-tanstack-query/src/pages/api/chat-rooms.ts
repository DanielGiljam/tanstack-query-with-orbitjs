import {NextApiRequest, NextApiResponse} from "next";

import {prisma} from "../../prisma";

const chatRooms = async (_req: never, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.status(405).json({statusMessage: "Method not allowed"});
        return;
    }
    const chatMessages = await prisma.chatMessage.findMany({
        distinct: ["chatRoomId"],
        orderBy: {createdAt: "desc"},
        take: 10,
        include: {chatRoom: true, sender: true},
    });
    const chatRooms = chatMessages.map(
        ({chatRoomId, chatRoom, ...chatMessage}) => ({
            ...chatRoom,
            latestChatMessageId: chatMessage.id,
            latestChatMessage: chatMessage,
        }),
    );
    res.status(200).json(chatRooms);
};

export default chatRooms;
