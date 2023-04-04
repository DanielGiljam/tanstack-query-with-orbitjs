import fs from "fs/promises";
import path from "path";

import {faker} from "@faker-js/faker";
import {PrismaClient} from "@prisma/client";

const promiseInSequence = async <T>(
    promises: Array<() => Promise<T>>,
): Promise<T[]> => {
    const results: T[] = [];
    for (const promise of promises) {
        results.push(await promise());
    }
    return results;
};

const prisma = new PrismaClient();

const seed = async () => {
    const users = await promiseInSequence(
        Array.from(
            Array(8),
            () => async () =>
                await prisma.user.create({
                    data: {name: faker.internet.userName()},
                }),
        ),
    );
    const chatRooms = await promiseInSequence(
        Array.from(
            Array(32),
            () => async () =>
                await prisma.chatRoom.create({
                    data: {
                        name: `${faker.word.adjective()} ${faker.word.noun()}`,
                    },
                }),
        ),
    );
    const chatMessages = await promiseInSequence(
        chatRooms.flatMap((chatRoom) =>
            Array.from(
                Array(parseInt(faker.random.numeric(2))),
                () => async () =>
                    await prisma.chatMessage.create({
                        data: {
                            text: faker.lorem.sentence(),
                            chatRoom: {connect: {id: chatRoom.id}},
                            sender: {
                                connect: {
                                    id: faker.helpers.arrayElement(users).id,
                                },
                            },
                        },
                        include: {chatRoom: true, sender: true},
                    }),
            ),
        ),
    );
    await fs.writeFile(
        path.join(__dirname, "seed-data.json"),
        JSON.stringify(chatMessages, null, 4),
    );
};

seed()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect().catch((error) => console.error(error));
        process.exit(1);
    });
