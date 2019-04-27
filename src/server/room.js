import {speakerNamespace} from "./index";
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

// Initialize a room in the `roomStates` object
// - Room code and initial state are optional
export const makeRoom = function (roomCode, initialState = {}) {
    // Get room code from either provided (uppercased) or make one
    roomCode = roomCode.toUpperCase() || makeRoomCode();

    // Initialize state for new room
    roomStates[roomCode] = {
        // Default committee
        committee: "",
        // Boolean for if the room is voting
        voting: false,
        // Initialize the stored audience members
        audience: new Map(),
        // Initialize the stored speakers
        speakers: new Map(),

        // Spread in overrides
        ...initialState,
    };

    // Return back capitalized/generated room code
    return roomCode;
};


export const sendState = function (namespace, roomCode, data) {
    // If the "namespace" is actually a Socket instance
    const isSocket = Object.getPrototypeOf(namespace).constructor.name === "Socket";

    // Emit update state event
    // Don't send to a room if there isn't one or if it's a socket
    (!isSocket && roomCode ? namespace.to(roomCode) : namespace).emit(
        "set state",
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

export const getMembers = function (type, roomCode) {
    return [...roomStates[roomCode][type]].map(
        ([uuid, member]) => {
            member.uuid = uuid;
            return member;
        },
    );
};
export const getAudience = function (roomCode) {
    return getMembers("audience", roomCode);
};
export const getSpeakers = function (roomCode) {
    return getMembers("speakers", roomCode);
};
export const sendAudience = function (roomCode) {
    sendState(speakerNamespace, roomCode, {
        audience: getAudience(roomCode),
    });
};
