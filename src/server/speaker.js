import {makeRoom, sendState, sendPickedState, roomStates, getAudience, getSpeakers, sendAudience} from "./room";
import {audienceNamespace, speakerNamespace, getSocketsByUuid, uuids, uuidInRoom} from "./index";


export const connect = function () {
	// eslint-disable-next-line no-console
	console.log("A speaker connected");
};

// When a speaker joins a room
export const join = function (member, reject) {
	member.roomCode = member.roomCode.toUpperCase();
	member.speaker = true;
	const {roomCode} = member;
	const {committee} = roomStates[roomCode];
	const uuid = uuids.get(this);

	// Rejections
	if (!member) return reject("Could not join a room because no data was passed to the server.");
	if (!roomCode) return reject("Could not join a room because no room code was entered.");
	if (!(roomCode in roomStates)) return reject(`Could not join ${roomCode} as it doesn't exist or is no longer available.`);

	uuidInRoom[uuid] = roomCode;

	// Set the data in the speakers Map
	roomStates[roomCode].speakers.set(uuid, member);

	// Join room with socket
	this.join(roomCode);
	// Send initial state
	sendPickedState(
		this,
		roomCode,
		["committee", "voting"],
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
	const uuid = uuids.get(this);

	delete uuidInRoom[uuid];

	// Delete speaker
	roomStates[roomCode].speakers.delete(uuid);
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
			audience: [],
			speakers: [],
		},
	);

	// eslint-disable-next-line no-console
	console.log(`A speaker left ${committee} (${roomCode})`);
};

export const startVoting = function (member) {
	const {roomCode} = member;

	roomStates[roomCode].voting = true;
	sendPickedState(speakerNamespace, roomCode, ["voting"]);
	sendPickedState(audienceNamespace, roomCode, ["voting"]);

	// eslint-disable-next-line no-console
	console.log(`Voting has started in ${roomCode}`);
};
export const endVoting = function (member) {
	const {roomCode} = member;

	roomStates[roomCode].voting = false;
	sendPickedState(speakerNamespace, roomCode, ["voting"]);
	sendPickedState(audienceNamespace, roomCode, ["voting"]);

	// Clear votes
	for (const [voterUuid, voterMember] of roomStates[roomCode].audience) {
		delete voterMember.vote;
		const voterSockets = getSocketsByUuid(voterUuid);
		for (const voterSocket of voterSockets) {
			sendState(voterSocket, roomCode, {member: voterMember});
		}
	}

	sendAudience(roomCode);

	// eslint-disable-next-line no-console
	console.log(`Voting has ended in ${roomCode}`);
};

export const lowerPlacard = function (members) {
	for (const clientMember of members) {
		const {roomCode, countryName, uuid} = clientMember;
		const member = roomStates[roomCode].audience.get(uuid);

		member.placard = {
			raised: false,
		};

		const memberSockets = getSocketsByUuid(uuid);
		for (const memberSocket of memberSockets) {
			sendState(memberSocket, roomCode, {member});
		}

		sendAudience(roomCode);

		// eslint-disable-next-line no-console
		console.log(`A speaker lowered ${countryName}'s placard`);
	}
};

export const listRooms = function (resolve) {
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
	const uuid = uuids.get(this);

	// Store rooms to update
	const rooms = Object.keys(this.rooms);

	// Iterate over rooms
	for (const roomCode of rooms) {
		// Skip the room made for the ID
		if (/\/speaker#/.test(roomCode)) {
			continue;
		}

		// Delete speaker
		roomStates[roomCode].speakers.delete(uuid);
	}

	// Delete the UUID entry for this socket (doesn't delete other sockets using the same UUID)
	uuids.delete(this);

	// eslint-disable-next-line no-console
	console.log(`A speaker disconnected (${reason})`);
};
