// The length of randomly created room codes
const roomCodeLength = 4;


// Make a random, available room code of four letters
export const makeRoomCode = function (roomStates) {
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
export const makeRoom = function (roomStates, roomCode, initalState = {}) {
    // Get room code from either provided (uppercased) or make one
    roomCode = (roomCode && roomCode.toUpperCase()) || makeRoomCode(roomStates);

    // Initalize state for new room
    roomStates[roomCode] = {
        // Default committee
        committee: "",
        // Audience TODO: move to native sockets code?
        audience: [],
        // Speakers
        speakers: [],
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

    // Return back capitalized/generated room code
    return roomCode;
};
