import {NextApiRequest, NextApiResponse} from "next";

import {prisma} from "../../../../prisma";
import {idSchema} from "../../../../server";

const chatMessages = async (req: NextApiRequest, res: NextApiResponse) => {
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
    try {
        await prisma.chatRoom.findUniqueOrThrow({
            where: {id: chatRoomId},
            select: {id: true},
        });
    } catch {
        res.status(404).json({statusMessage: "Not found"});
        return;
    }
    const chatMessages = await prisma.chatMessage.findMany({
        where: {chatRoomId},
        orderBy: {createdAt: "desc"},
        take: 10,
        include: {sender: true},
    });
    res.status(200).json(chatMessages);
};

export default chatMessages;
