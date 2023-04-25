import {Server as HttpServer} from "http";

import {NextApiResponse} from "next";
import {Server as SocketIoServer} from "socket.io";

import {initSocket} from "../../server";

export const config = {
    api: {
        bodyParser: false,
    },
};

declare module "net" {
    interface Socket {
        server: HttpServer;
    }
}

declare module "http" {
    interface Server {
        socketIo: SocketIoServer | undefined;
    }
}

const socket = async (_req: never, res: NextApiResponse) => {
    if (res.socket != null) {
        res.socket.server.socketIo ??= await initSocket(res.socket.server);
    }
    res.end();
};

export default socket;
