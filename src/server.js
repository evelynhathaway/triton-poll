const express = require("express");
const SocketIO = require("socket.io");
const path = require("path");

const {makeRoom} = require("./make-room");

const questions = require("./questions");


// Setup express app
const app = express();
// Paths
const publicPath = path.resolve(__dirname, "../public");
const modulesPath = path.resolve(__dirname, "../node_modules");
// Serve static assets first
app.use("/bootstrap", express.static(modulesPath + "/bootstrap/dist"));
app.use("/", express.static(publicPath));
// Serve all routes as `index.html` for client-side routing
app.get("/*", (request, response) => {
    response.sendFile("/index.html", {root: publicPath});
});
// Listen, create server
const server = app.listen(3000);

// Create Socket.io server on express server instance
const io = SocketIO.listen(server);
// Create namespaces for the audience and speakers
const audienceNamespace = io.of('/audience');
const speakerNamespace = io.of('/speaker');

// Create object for the state for each room
const roomStates = {};


// Event handler for audience member connections
audienceNamespace.on("connection", function (socket, callback) {
    socket.on("join", function (payload) {
        const {countryName, roomCode} = payload;

        if (!(roomCode in roomStates)) {
            callback({error: `There's no session with the room code "${roomCode}"`});
            return;
        }

        roomStates[roomCode].audience.push({
            id: this.id,
            countryName,
        });

        // Send inital state
        callback({
            // Spread in extracted state to send
            state: {committee, currentQuestion} = roomStates[roomCode],
        });

        // Broadcast to speakers in room
        speakerNamespace.to(roomCode).sockets.emit("audience joined", countryName);

        console.log(`${countryName} joined room ${roomCode}`);
    });

    socket.on("answer", function (payload) {
        results[payload.choice]++;
        audienceNamespace.sockets.emit("results", results);
        console.log("Answer: \"%s\" - %j", payload.choice, results);
    });

    // Disconnection handler
    socket.once("disconnect", function () {
        for (const roomCode of this.nsp.rooms) {
            roomStates[roomCode].audience = roomStates[roomCode].audience.filter(member => {
                if (member.id !== this.id) {
                    speakerNamespace.to(roomCode).sockets.emit("audience left", member);
                    console.log(`${member.countryName} left room ${roomCode}`);
                    return true;
                }
                return false;
            });
            speakerNamespace.to(roomCode).sockets.emit("audience", audience);
        }

        socket.disconnect();
    });

    console.log("An audience member connected");
});


// Event handler for speaker connections
speakerNamespace.on("connection", function (socket) {
    socket.on("create room", function (payload, callback) {
        const {committee} = payload;
        let {roomCode} = payload;

        // Make new room, store room code if changed
        roomCode = makeRoom(
            // Pass in global state to mutate
            roomStates,
            // Code to use if provied one
            roomCode,
            // State to override defaults
            {
                committee,
            },
        );

        console.log(`Room created: ${committee} (${roomCode})`);

        // Send roomCode to speaker for them to join the room
        callback(roomCode);
    });

    //speaker starts event, info about name title of presentation is in payload
    socket.on("join", function (payload) {
        const {roomCode} = payload;

        roomStates[roomCode].speakers.push(this.id);
        speakerNamespace.to(roomCode).emit("speaker joined");
        console.log(`A speaker joined ${committee} (${roomCode})`);
    });

    socket.on("ask", function (question) {
        roomStates[roomCode].currentQuestion = question;
        roomStates[roomCode].results = {a: 0, b: 0, c: 0, d: 0};
        audienceNamespace.sockets.emit("ask", question);
        console.log(`"${question.q}" asked in ${roomCode}`);
    });

    // Disconnection handler
    // TODO
    socket.once("disconnect", function () {
        for (const roomCode of this.nsp.rooms) {
            roomStates[roomCode].audience = roomStates[roomCode].audience.filter(member => {
                if (member.id !== this.id) {
                    speakerNamespace.to(roomCode).sockets.emit("audience left", member);
                    console.log(`${member.countryName} left room ${roomCode}`);
                    return true;
                }
                return false;
            });
            speakerNamespace.to(roomCode).sockets.emit("audience", audience);
        }

        socket.disconnect();
    });

    // Emit welcome on load to send inital state
    socket.emit("welcome", {
        // Create an array of rooms for the client to display if wanting to join an existing room
        rooms: Object.keys(roomStates).map(roomCode => {
            return {
                // Room code
                roomCode,
                // Spread in extracted state to send
                ...{committee} = roomStates[roomCode],
            }
        }),
    });

    console.log("A speaker connected");
});


console.log("Server is running at localhost:3000/");
