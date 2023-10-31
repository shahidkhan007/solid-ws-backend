import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { Router, json } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { RoomRouter } from "./controllers/Room/RoomController";

export const prisma = new PrismaClient();
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors({ origin: "http://127.0.0.1:5173", credentials: true }));
app.use(json());

const apiRouter = Router();

app.use("/api", apiRouter);

apiRouter.use("/room", RoomRouter);

async function main() {
    io.on("connection", (socket) => {
        socket.on("join-room", async (data: JoinRoomMessage) => {
            await socket.join(data.room.toString());
            socket.emit("join-room-ack", { success: true } as JoinRoomAck);
        });

        socket.on("message", (msg: Message) => {
            io.in(msg.targetRoom.toString()).emit("room-message", msg);
        });

        socket.on("disconnect", (reason, description) => {
            socket.disconnect(true);
        });
    });

    server.listen(8000, () => console.log("App started at port 8000"));
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (err) => {
        console.error(err);
        await prisma.$disconnect();
    });
