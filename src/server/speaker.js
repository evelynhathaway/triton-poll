import {audienceNamespace, speakerNamespace} from "./index";
import {lowerPlacard as lowerPlacardAudience} from "./audience";
import {makeRoom, sendState, sendPickedState, roomStates, getAudience, getSpeakers} from "./room";


export const connect = function (socket) {
    // eslint-disable-next-line no-console
    console.log("A speaker connected");
};

// When a speaker joins a room
export const join = function (member, reject) {
    member.roomCode = member.roomCode.toUpperCase();
    member.speaker = true;
    const {roomCode} = member;
    const {committee} = roomStates[roomCode];

    // Rejections
    if (!member) return reject("Could not join a room because no data was passed to the server.");
    if (!roomCode) return reject("Could not join a room because no room code was entered.");
    if (!(roomCode in roomStates)) return reject(`Could not join ${roomCode} as it doesn't exist or is no longer available.`);

    // Set the data in the speakers Map
    roomStates[roomCode].speakers.set(this, member);

    // Join room with socket
    this.join(roomCode);
    // Send inital state
    sendPickedState(
        this,
        roomCode,
        ["committee", "voting", "votes"],
        {
            member,
            audience: getAudience(roomCode),
            speakers: getSpeakers(roomCode),
        },
    );

    // eslint-disable-next-line no-console
    console.log(`A speaker joined ${committee} (${roomCode})`);
};
export const leave = function (member) {
    const {roomCode} = member;
    const {committee} = roomStates[roomCode];

    // Delete speaker
    roomStates[roomCode].speakers.delete(this);
    // Leave room with socket
    this.leave(roomCode);
    // Send empty state
    sendState(
        this,
        undefined,
        {
            member: {},
            committee: "",
            voting: false,
            votes: {},
            audience: [],
            speakers: [],
        },
    );

    // eslint-disable-next-line no-console
    console.log(`A speaker left ${committee} (${roomCode})`);
};

export const startVoting = function (data) {
    const {roomCode} = data;
    roomStates[roomCode].voting = true;
    sendPickedState(speakerNamespace, roomCode, ["voting", "votes"]);
    sendPickedState(audienceNamespace, roomCode, ["voting"]);
    console.log("startVoting");
};
export const endVoting = function (data) {
    const {roomCode} = data;
    roomStates[roomCode].voting = false;
    sendPickedState(speakerNamespace, roomCode, ["voting", "votes"]);
    sendPickedState(audienceNamespace, roomCode, ["voting"]);
    // Clear votes
    roomStates[roomCode].votes.clear();
    console.log("endVoting");
};

export const lowerPlacard = function (members) {
    for (const member of members) {
        lowerPlacardAudience.bind(member)
    }
};

export const ask = function ({question}) {
    roomStates[roomCode].currentQuestion = question;
    roomStates[roomCode].results = {a: 0, b: 0, c: 0, d: 0};
    audienceNamespace.sockets.emit("ask", question);

    // eslint-disable-next-line no-console
    console.log(`"${question.q}" asked in ${roomCode}`);
};

export const listRooms = function (resolve, reject) {
    resolve({
        // Create an array of rooms for the client to display if wanting to join an existing room
        rooms: Object.keys(roomStates).map(roomCode => {
            return {
                // Room code
                roomCode,
                // Extract state to send
                committee: roomStates[roomCode].committee,
            };
        }),
    });
};

export const createRoom = function (data, reject) {
    const {committee, join: joinOption} = data;
    let {roomCode} = data;

    // Send error to client if there the room isn't available
    if (roomCode in roomStates) return reject(`The room code ${roomCode} is already in use.`);

    // Make new room, store room code if changed
    roomCode = makeRoom(
        // Code to use if provied one
        roomCode,
        // State to override defaults
        {committee},
    );

    // eslint-disable-next-line no-console
    console.log(`Room created: ${committee} (${roomCode})`);

    // Join room if set
    joinOption && join.call(this, {roomCode}, reject);
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
        if (/\/speaker#/.test(roomCode)) {
            continue;
        }

        // Delete speaker
        roomStates[roomCode].speakers.delete(this);
        // Broadcast speaker change to speakers in room
        // sendAudience(roomCode); // TODO speakers

    }

    // eslint-disable-next-line no-console
    console.log(`A speaker disconnected (${reason})`);
};
