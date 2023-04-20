import {NextApiRequest, NextApiResponse} from "next";
import {z} from "zod";
import {fromZodError} from "zod-validation-error";

import {prisma} from "../../prisma";

const nextQuerySchema = z.object({
    count: z.coerce.number().int().finite().nonnegative().default(10),
    offset: z.coerce.number().int().finite().nonnegative().default(0),
});

const chatRooms = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.status(405).json({statusMessage: "Method not allowed"});
        return;
    }
    const nextQueryParseResult = nextQuerySchema.safeParse(req.query);
    if (!nextQueryParseResult.success) {
        res.status(400).json({
            statusMessage: "Bad request",
            errorMessage: fromZodError(nextQueryParseResult.error).message,
        });
        return;
    }
    const chatMessages = await prisma.chatMessage.findMany({
        distinct: ["chatRoomId"],
        orderBy: {createdAt: "desc"},
        take: nextQueryParseResult.data.count,
        skip: nextQueryParseResult.data.offset,
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
