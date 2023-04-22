import {NextApiRequest, NextApiResponse} from "next";
import {z} from "zod";
import {fromZodError} from "zod-validation-error";

import {prisma} from "../../../../prisma";
import {idSchema} from "../../../../server";

const nextQuerySchema = z.object({
    count: z.coerce.number().int().finite().nonnegative().default(10),
    offset: z.coerce.number().int().finite().nonnegative().default(0),
});

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
        await prisma.chatRoom.findFirstOrThrow({
            where: {id: chatRoomId, chatMessages: {some: {}}},
            select: {id: true},
        });
    } catch {
        res.status(404).json({statusMessage: "Not found"});
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
        where: {chatRoomId},
        orderBy: {createdAt: "desc"},
        take: nextQueryParseResult.data.count,
        skip: nextQueryParseResult.data.offset,
        include: {sender: true},
    });
    res.status(200).json(chatMessages);
};

export default chatMessages;
