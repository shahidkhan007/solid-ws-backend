type Message = {
    type: import("./controllers/Room/RoomController").MessageType;
    content: any;
    targetRoom: number;
};

type JoinRoomMessage = {
    room: number;
};

type JoinRoomAck = {
    success: boolean;
};
