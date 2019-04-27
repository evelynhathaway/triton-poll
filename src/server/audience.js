import {uuids} from "./index";
import {sendState, sendPickedState, sendAudience, roomStates} from "./room";


export const connect = function () {
    // eslint-disable-next-line no-console
    console.log("An audience member connected");
};

// When an audience member joins a room with a country name
export const join = function (clientMember, reject) {
    const {roomCode, countryName} = clientMember;
    const uuid = uuids.get(this);

    // Rejections
    if (!clientMember) return reject("Could not join a room because no data was passed to the server.");
    if (!roomCode) return reject("Could not join a room because no room code was entered.");
    if (!countryName) return reject("Could not join a room because no country name was entered.");
    if (!(roomCode in roomStates)) return reject(`Could not join ${roomCode} as it doesn't exist or is no longer available.`);

    // Re-make member object as to not inject state, normalize
    const member = {
        roomCode: clientMember.roomCode.toUpperCase(),
        countryName,
        placard: {
            raised: false,
        },
    };

    // Set the data in the audience Map
    roomStates[roomCode].audience.set(uuid, member);
    // Join room with socket
    this.join(roomCode);
    // Send initial state
    sendPickedState(
        this,
        roomCode,
        ["committee", "voting"],
        {member},
    );

    // Broadcast audience change to speakers in room
    sendAudience(roomCode);

    // eslint-disable-next-line no-console
    console.log(`${countryName} joined room ${roomCode}`);
};
export const leave = function (member) {
    member.roomCode = member.roomCode.toUpperCase();
    const {roomCode, countryName} = member;
    const uuid = uuids.get(this);

    // Delete audience member
    roomStates[roomCode].audience.delete(uuid);
    // Leave room with socket
    this.leave(roomCode);
    // Send empty state
    sendState(
        this,
        undefined,
        {
            member: {},
            committee: "",
        },
    );
    // Broadcast audience change to speakers in room
    sendAudience(roomCode);

    // eslint-disable-next-line no-console
    console.log(`${countryName || "An audience member"} left room ${roomCode}`);
};


export const raisePlacard = function (clientMember) {
    const {roomCode, countryName} = clientMember;
    const uuid = uuids.get(this);
    const member = roomStates[roomCode].audience.get(uuid);

    member.placard = {
        raised: true,
        timeRaised: Date.now(),
    };

    sendState(this, roomCode, {member});
    sendAudience(roomCode);

    // eslint-disable-next-line no-console
    console.log(`${countryName} raised their placard`);
};
export const lowerPlacard = function (clientMember) {
    const {roomCode, countryName} = clientMember;
    const uuid = uuids.get(this);
    const member = roomStates[roomCode].audience.get(uuid);

    member.placard = {
        raised: false,
    };

    sendState(this, roomCode, {member});
    sendAudience(roomCode);

    // eslint-disable-next-line no-console
    console.log(`${countryName} lowered their placard`);
};
export const vote = function (clientMember, position) {
    const {roomCode, countryName} = clientMember;
    const uuid = uuids.get(this);
    const member = roomStates[roomCode].audience.get(uuid);

    if (!roomStates[roomCode].voting) {
        return; // TODO: reject
    }

    member.vote = position;

    sendState(this, roomCode, {member});
    sendAudience(roomCode);

    // eslint-disable-next-line no-console
    console.log(`${countryName} voted ${position}`);
};


// Disconnection handler
// - `disconnecting` instead of `disconnect` to capture the rooms to update
export const disconnecting = function (reason) {
    const uuid = uuids.get(this);

    // Store rooms to update
    const rooms = Object.keys(this.rooms);

    // Finish disconnecting so it leaves its rooms
    this.disconnect();

    // Iterate over rooms
    for (const roomCode of rooms) {
        // Skip the room made for the ID
        if (/\/audience#/.test(roomCode)) {
            continue;
        }

        // Delete the UUID entry for this socket (doesn't delete other sockets using the same UUID)
        uuids.delete(this);

        // TODO: set the status to disconnected and don't delete if they've voted or raised their placard. Then clean the audience out after voting stops or delete the specific member if their placard get's lowered by either the speaker. Allow the state of the disconnected user to be used when re-joining (just use the country name as a unique identifier for now)

        // Delete audience member
        const member = roomStates[roomCode].audience.get(uuid);
        member.status = "disconnected"; // TODO check if others are using this ID

        // Broadcast audience change to speakers in room
        sendAudience(roomCode);
    }

    // eslint-disable-next-line no-console
    console.log(`An audience member disconnected (${reason})`);
};
