import {uuids, uuidInRoom, getSocketsByUuid} from "./index";
import {sendState, sendPickedState, sendAudience, roomStates} from "./room";


export const connect = function () {
	const uuid = uuids.get(this);
	const roomCode = uuidInRoom[uuid];
	const member = roomCode && roomStates[roomCode].audience.get(uuid);

	if (member) {
		join.call(this, member, () => {});
	}

	// eslint-disable-next-line no-console
	console.log("An audience member connected");
};

// When an audience member joins a room with a country name
export const join = function (member, reject) {
	member.roomCode = member.roomCode.toUpperCase();
	member.status = "connected";
	member.placard = member.placard || {raised: false};
	const {roomCode, countryName} = member;
	const uuid = uuids.get(this);

	// Rejections
	if (!member) return reject("Could not join a room because no data was passed to the server.");
	if (!roomCode) return reject("Could not join a room because no room code was entered.");
	if (!countryName) return reject("Could not join a room because no country name was entered.");
	if (!(roomCode in roomStates)) return reject(`Could not join ${roomCode} as it doesn't exist or is no longer available.`);

	uuidInRoom[uuid] = roomCode;

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

	delete uuidInRoom[uuid];

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

	// Iterate over rooms
	for (const roomCode of rooms) {
		// Skip the room made for the ID
		if (/\/audience#/.test(roomCode)) {
			continue;
		}

		// Is there more than one sockets (before removal of this one)?
		const hasOtherSockets = getSocketsByUuid(uuid).length > 1;

		// If there's no other live sockets
		if (!hasOtherSockets) {
			const member = roomStates[roomCode].audience.get(uuid);
			// Mark disconnected
			member.status = "disconnected";

			// Broadcast audience change to speakers in room
			sendAudience(roomCode);
		}
	}

	// Delete the UUID entry for this socket (doesn't delete other sockets using the same UUID)
	uuids.delete(this);

	// eslint-disable-next-line no-console
	console.log(`An audience member disconnected (${reason})`);
};
