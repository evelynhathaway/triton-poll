import {audienceNamespace} from "./index";
import {sendState, sendPickedState, sendAudience, roomStates} from "./room";


export const connect = function () {
    // eslint-disable-next-line no-console
    console.log("An audience member connected");
};

// When an audience member joins a room with a country name
export const join = function (member, reject) {
    member.roomCode = member.roomCode.toUpperCase();
    const {roomCode, countryName} = member;

    // Rejections
    if (!member) return reject("Could not join a room because no data was passed to the server.");
    if (!roomCode) return reject("Could not join a room because no room code was entered.");
    if (!countryName) return reject("Could not join a room because no country name was entered.");
    if (!(roomCode in roomStates)) return reject(`Could not join ${roomCode} as it doesn't exist or is no longer available.`);

    // Set the data in the audience Map
    roomStates[roomCode].audience.set(this, member);
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

    // Delete audience member
    roomStates[roomCode].audience.delete(this);
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


export const raisePlacard = function () {
    console.log("raisePlacard");
};
export const lowerPlacard = function () {
    console.log("lowerPlacard");
};
export const vote = function (clientMember, vote) {
    const {roomCode, countryName} = clientMember;
    const member = roomStates[roomCode].audience.get(this);

    if (!roomStates[roomCode].voting) {
        return; // TODO: reject
    }

    member.vote = vote;
    roomStates[roomCode].audience.set(this, member);
    roomStates[roomCode].voters.add(this);

    sendState(this, roomCode, {member});
    sendAudience(roomCode);

    // eslint-disable-next-line no-console
    console.log(`${countryName} voted ${vote}`);
};


// Disconnection handler
// - `disconnecting` instead of `disconnect` to capture the rooms to update
export const disconnecting = function (reason) {
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

        // TODO: set the status to disconnected and don't delete if they've voted or raised their placard. Then clean the audience out after voting stops or delete the specific member if their placard get's lowered by either the speaker. Allow the state of the disconnected user to be used when re-joining (just use the country name as a unique identifier for now)

        // Delete audience member
        roomStates[roomCode].audience.delete(this);
        // Broadcast audience change to speakers in room
        sendAudience(roomCode);
    }

    // eslint-disable-next-line no-console
    console.log(`An audience member disconnected (${reason})`);
};
