const express = require("express");
const _ = require("underscore");

// here we'll store our connections...
const connections = [];
const questions = require("./app-questions");

const roomStates = {};

// TODO: move, comment
let roomCodeLength = 4;
const makeRoomCode = function (roomStates) {
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

const makeRoom = function (roomStatess, roomCode, roomState) {
    // Get room code from either provided (uppercased just in case) or make one
    roomCode = (roomCode && roomCode.toUpperCase()) || makeRoomCode(roomStates);

    // Initalize state for new room
    roomStates[roomCode] = {
        // Default committee
        committee: "Triton MUN",
        // Audience TODO: move to native sockets code?
        audience: [],
        // Speaker data
        speaker: {},
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
        ...roomState
    };

    // Return back generated room code
    return roomCode;
};

const app = express();
app.use("/public", express.static("./public"));
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));
app.get("/*", (request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

const server = app.listen(3000);

const io = require("socket.io").listen(server);

// event handler for when a socket connects
io.sockets.on("connection", function (socket) {
    console.log(socket.id, connections)
    // TODO: comment, make
    socket.on("create room", function (payload) {
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

        // Mutate state for room
        roomStates[roomCode].committee = committee;

        // Send roomNumber to speaker, add them to the room
        this.join(roomCode); // TODO: `socket`?
    });

    //listening to join event from client side when someone joins presentation...
    socket.on("join", function (payload) {
        const {countryName, roomCode} = payload;

        if (!(roomCode in roomStates)) {
            this.emit("incorrect room", roomCode);
            return;
        }

        const newMember = {
            id: this.id,
            countryName,
        };


        roomStates[roomCode].audience.push(newMember);
        console.log(`${countryName} joined room ${roomCode}`);

        //now we need to emit message to that client that we recieved payload with name of audience member...
        this.emit("joined", newMember);

        // TODO: broadcast to speaker only
        //now we emit message to ALL audience members that new member is in... BROADCASTING EVENT
        // io.sockets.emit("audience", audience);
    });

    //speaker starts event, info about name title of presentation is in payload
    socket.on("start", function (payload) {
        speaker.name = payload.name;
        speaker.id = this.id;
        speaker.type = "speaker";
        title = payload.title;

        this.emit("joined", speaker);
        //broadcast app state to all audience members that are already logged in...
        io.sockets.emit("start", {
            title: title,
            speaker: speaker.name,
        });
        console.log("Presentation Started: \"%s\" by %s", title, speaker.name);
    });

    socket.on("ask", function (question) {
        currentQuestion = question;
        results = {a:0, b:0, c:0, d:0};
        io.sockets.emit("ask", currentQuestion);
        console.log("Question asked \"%s\"", question.q);
    });

    socket.on("answer", function (payload) {
        results[payload.choice]++;
        io.sockets.emit("results", results);
        console.log("Answer: \"%s\" - %j", payload.choice, results);
    });

    // when new user connects send him title, audience, speaker variable content...
    // sending him an object with prop title,speaker,audience wich have title, speaker, audience variable as content...
    // TODO: send less and per room
    // socket.emit("welcome", {
    //     title : committ,
    //     audience: audience,
    //     speaker: speaker.name,
    //     questions: questions,
    //     currentQuestion: currentQuestion,
    //     results: results,
    // });

    // push to connections array...
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);


    // disconnect handler...
    socket.once("disconnect", function () {
        for (const roomCode of this.nsp.rooms) {
            roomStates[roomCode].audience = roomStates[roomCode].audience.filter(member => {
                if (member.id !== this.id) {
                    io.to(roomCode).sockets.emit("audience left", member);
                    console.log(`${member.countryName} left room ${roomCode}`);
                    return true;
                }
                return false;
            });
            io.to(roomCode).sockets.emit("audience", audience);
        }
        // find a member of an audience that have the same id as currently diisconnecting socket...
        const member = _.findWhere(audience, {
            id: this.id,
        });
        //if member exists, remove it from audience array, broadcast new audience state, and log new data to console...
        // TODO: fix bug where opening two tabs on the speaker's browser and closing one triggers this
        if (member) {
            audience.splice(audience.indexOf(member), 1);
            io.sockets.emit("audience", audience);
        } else if (this.id === speaker.id) {
            console.log("%s has left. '%s' is over!", speaker.name, title);
            speaker = {};
            title = "Untitled presentation";
            io.sockets.emit("end", {
                title: title,
                speaker : "",
                audience: audience,
            });
        }

        // connections.splice(connections.indexOf(socket), 1);
        socket.disconnect();
        // console.log("Disconnected! %s sockets remaining", connections.length);
    });
});


console.log("Polling server is running at localhost:3000/ ");
