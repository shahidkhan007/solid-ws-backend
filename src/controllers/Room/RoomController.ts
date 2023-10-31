import { Router } from "express";
import { prisma } from "../..";

export const RoomRouter = Router();

export enum MessageType {
    Text,
}

RoomRouter.get("/", async (req, res) => {
    const _rooms = prisma.room.findMany();
    const _count = prisma.room.count();

    const [rows, count] = await Promise.all([_rooms, _count]);

    res.json({
        rows,
        count,
    });
});

RoomRouter.post("/", async (req, res) => {
    const room = await prisma.room.create({ data: { name: req.body.name } });
    res.status(201).json({ entity: room, message: `Room '${room.name} created successfully.` });
});
