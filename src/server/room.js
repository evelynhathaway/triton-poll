import {speakerNamespace, uuids, getSocketsByUuid} from "./index";
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
            return {
                ...member,
                uuid,
            };
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


export const cleanUpAudienceMember = function (socket, roomCode) {
    const uuid = uuids.get(socket);

    // Is there more than one sockets (before removal of this one)?
    const hasOtherSockets = getSocketsByUuid(uuid).length > 1;

    // If there's no other live sockets
    if (!hasOtherSockets) {
        const member = roomStates[roomCode].audience.get(uuid);
        const {vote, placard} = member;
        const {raised} = placard;

        if (raised || vote) {
            // If there is a vote or placard up, keep alive but mark disconnected (differ to another clean up)
            member.status = "disconnected";
            console.log(`Deferred clean up of ${uuid}`);
        } else {
            // Delete the member from the Map as there's no data worth keeping
            roomStates[roomCode].audience.delete(uuid);
            console.log(`Cleaned up ${uuid} after disconnecting`);
        }

        // Broadcast audience change to speakers in room
        sendAudience(roomCode);
    }
};
export const cleanUpAudience = function (roomCode) {
    let hasUpdated = false;

    for (const [uuid, member] of roomStates[roomCode].audience) {
        const {vote, placard, status} = member;
        const {raised} = placard;

        if (status === "disconnected" && !raised && !vote) {
            // If there is not longer a vote or placard up, delete
            roomStates[roomCode].audience.delete(uuid);
            console.log(`Cleaned up ${uuid} after being deffered`);
            hasUpdated = true;
        }
    }

    return hasUpdated;
};
