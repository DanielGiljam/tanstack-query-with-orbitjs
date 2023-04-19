import {Server as HttpServer} from "http";

import {faker} from "@faker-js/faker";
import {Server as SocketIoServer} from "socket.io";

import {prisma} from "../prisma";

const sendRandomChatMessage = async (
    socket: SocketIoServer,
    userIds: string[],
    chatRoomIds: string[],
) => {
    try {
        const chatMessage = await prisma.chatMessage.create({
            data: {
                text: faker.lorem.sentence(),
                senderId: faker.helpers.arrayElement(userIds),
                chatRoomId: faker.helpers.arrayElement(chatRoomIds),
            },
            include: {sender: true},
        });
        socket.emit("new-chat-message", chatMessage);
    } catch (error) {
        console.error(error);
    }
    await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 4500),
    );
    await sendRandomChatMessage(socket, userIds, chatRoomIds);
};

export const initSocket = async (server: HttpServer) => {
    const users = await prisma.user.findMany({skip: 1});
    const userIds = users.map((user) => user.id);
    const chatRooms = await prisma.chatRoom.findMany();
    const chatRoomIds = chatRooms.map((chatRoom) => chatRoom.id);
    const socket = new SocketIoServer(server, {path: "/api/socket"});
    console.log("socket.io initialized.");
    socket.on("connect", (socket) => {
        console.log("client connected through web socket");
        socket.on("disconnect", () =>
            console.log("client disconnected from web socket"),
        );
    });
    void sendRandomChatMessage(socket, userIds, chatRoomIds);
    return socket;
};
