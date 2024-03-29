import {NextApiRequest, NextApiResponse} from "next";
import {z} from "zod";
import {fromZodError} from "zod-validation-error";

import {prisma} from "../../../../prisma";
import {idSchema, initSocket} from "../../../../server";

const reqBodySchema = z.object({
    text: z
        .string()
        .transform((text) => text.trim())
        .pipe(z.string().nonempty()),
});

const chatMessage = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
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
    const bodyParseResult = reqBodySchema.safeParse(req.body);
    if (!bodyParseResult.success) {
        res.status(400).json({
            statusMessage: "Bad request",
            errorMessage: fromZodError(bodyParseResult.error).message,
        });
        return;
    }
    const text = bodyParseResult.data.text;
    const sender = await prisma.user.findFirst({where: {}, select: {id: true}});
    if (sender == null) {
        throw new Error("Sender is null.");
    }
    const senderId = sender.id;
    const chatMessage = await prisma.chatMessage.create({
        data: {text, senderId, chatRoomId},
        include: {sender: true},
    });
    if (res.socket != null) {
        const socket = (res.socket.server.socketIo ??= await initSocket(
            res.socket.server,
        ));
        socket.emit("new-chat-message", chatMessage);
    }
    res.status(201).json(chatMessage);
};

export default chatMessage;
