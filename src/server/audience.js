import {audienceNamespace, socketData} from "./index";
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
    if (!member) return reject(`Could not join a room because no data was passed to the server.`);
    if (!roomCode) return reject(`Could not join a room because no room code was entered.`);
    if (!countryName) return reject(`Could not join a room because no country name was entered.`);
    if (!(roomCode in roomStates)) return reject(`Could not join ${roomCode} as there's no session with that room code.`);

    // Set the data in the global WeakMap
    socketData.set(this, member);
    // Join room with socket
    this.join(roomCode);
    // Send inital state
    sendPickedState(
        this,
        roomCode,
        ["committee"],
        {member},
    );
    // Broadcast audience change to speakers in room
    sendAudience(roomCode);

    // eslint-disable-next-line no-console
    console.log(`${countryName} joined room ${roomCode}`);
};
export const leave = function (member) {
    member.roomCode = member.roomCode.toUpperCase();
    const {roomCode} = member;
    const {countryName} = socketData.get(this);

    // Reset the data in the global WeakMap
    socketData.set(this, {});
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
export const vote = function () {
    console.log("function");
};
export const requestToSpeak = function () {
    console.log("requestToSpeak");
};
export const answer = function (data) {
    results[data.choice]++;
    audienceNamespace.sockets.emit("results", results);

    // eslint-disable-next-line no-console
    console.log("Answer: \"%s\" - %j", data.choice, results);
};


// Disconnection handler
// - `disconnecting` instead of `disconnect` to capture the rooms to update
export const disconnecting = function (reason) {
    // Store rooms to update
    const rooms = Object.keys(this.rooms);
    const countryName = socketData.get(this)?.countryName;

    // Finish disconnecting so it leaves its rooms
    this.disconnect();

    // Iterate over rooms
    for (const roomCode of rooms) {
        // Skip the room made for the ID
        if (/\/audience#/.test(roomCode)) {
            continue;
        }
        // Broadcast audience change to speakers in room
        sendAudience(roomCode);
    }


    // eslint-disable-next-line no-console
    console.log(`${countryName || "An audience member"} disconnected (${reason})`);
};