import {
    audienceNamespace,
    speakerNamespace,
    socketData,
} from "./index";
import {pick} from "./util";


// Create object for the state for each room
export const roomStates = {};

// The length of randomly created room codes
const roomCodeLength = 4;
// Make a random, available room code of four letters
export const makeRoomCode = function () {
    let roomCode;
    // This while loop will hang if there's few options left, but this is
    // for one conference not thousands, so my lazy butt is okay for now lol
    while (!roomCode || roomStates[roomCode]) {
        // Get random uppercase code
        roomCode = String.fromCharCode(
            // Fill array with `roomCodeLength` number of random numbers corresponding
            // to uppercase char codes, spread into `fromCharCode`'s ...args
            ...Array(roomCodeLength)
                .fill()
                // Random number between 65 through 90, inclusive
                .map(() => Math.round(Math.random() * 25) + 65)
        );
    }

    return roomCode;
};

// Initalize a room in the `roomStates` object
// - Room code and inital state are optional
export const makeRoom = function (roomCode = makeRoomCode(), initalState = {}) {
    // Get room code from either provided (uppercased) or make one
    roomCode = roomCode.toUpperCase();

    // Initalize state for new room
    roomStates[roomCode] = {
        // Default committee
        committee: "",
        // Boolean for if the room is voting
        voting: false,
        // Initalize the stored inactive voters / people with their placards raised, prevents
        // garbadge collection of their data, `countryName`: `Socket` instance pairs
        inactiveRaised: {},

        // Spread in overrides
        ...initalState,
    };

    // Make getters and setters for audience and speaker arrays
    // - From the global `socketData` WeakMap
    Object.defineProperties(roomStates[roomCode], {
        audience: {
            get: getAudience,
            enumerable: true,
        },
        speakers: {
            get: getSpeakers,
            enumerable: true,
        },
    });

    // Return back capitalized/generated room code
    return roomCode;
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
