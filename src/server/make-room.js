import {roomStates} from "./index";
import {getAudience, getSpeakers} from "./util";


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
        // Initalize the current question
        currentQuestion: false,
        // Initalize the results
        results: {
            a: 0,
            b: 0,
            c: 0,
            d: 0,
        },

        // Spread in overrides
        ...initalState
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
    })

    // Return back capitalized/generated room code
    return roomCode;
};
