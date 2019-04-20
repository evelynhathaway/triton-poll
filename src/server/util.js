import {audienceNamespace, speakerNamespace, socketData, roomStates} from "./index";

export const pick = (object, ...props) => {
    const accumulator = {};
    for (const prop of props) {
        accumulator[prop] = object[prop];
    }
    return accumulator;
};

export const sendState = function (namespace, roomCode, data) {
    // If the "namespace" is actually a Socket instance
    const isSocket = Object.getPrototypeOf(namespace).constructor.name === "Socket";

    // Emit update state event
    // Don't send to a room if there isn't one or if it's a socket
    (!isSocket && roomCode ? namespace.to(roomCode) : namespace).emit(
        "update state",
        data,
    );
};

export const sendPickedState = function (namespace, roomCode, properties, additions = {}) {
    sendState(
        namespace,
        roomCode,
        {
            ...additions,
            ...pick(roomStates[roomCode], ...properties),
        },
    );
};

export const getMembers = function (namespace, roomCode) {
    const room = namespace.adapter.rooms[roomCode];
    const sockets = room ? Object.keys(room.sockets) : [];
    return sockets.map(socket => socketData.get(
        namespace.sockets[socket],
    ));
};
export const getAudience = function (roomCode) {
    return getMembers(audienceNamespace, roomCode);
};
export const getSpeakers = function (roomCode) {
    return getMembers(speakerNamespace, roomCode);
};

export const sendAudience = function (roomCode) {
    sendState(speakerNamespace, roomCode, {audience: getAudience(roomCode)});
};
