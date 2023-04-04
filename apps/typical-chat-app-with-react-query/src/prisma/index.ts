import {PrismaClient} from "./client"; // eslint-disable-line import/no-relative-packages

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["query"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
