import express from "express";
import SocketIO from "socket.io";
import path from "path";

import {makeRoom} from "./make-room";

import * as audience from "./audience";
import * as speaker from "./speaker";


const DEVELOPMENT = process.env.NODE_ENV === "development";


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
const server = app.listen(DEVELOPMENT ? 8080 : 80);

// Create Socket.io server on express server instance
export const io = SocketIO.listen(server);
// Create namespaces for the audience and speakers
export const audienceNamespace = io.of('/audience');
export const speakerNamespace = io.of('/speaker');

// Create object for the state for each room
export const roomStates = {};
// Weakly store data about each connection
export const socketData = new WeakMap();


// Make a debugging room if in development mode
// This helps with hot reloaded/synced browsers that autoconnect to a room
DEVELOPMENT && makeRoom(
    "TEST",
    {
        committee: "DEBUG",
    },
);


// Event handler for audience member connections
audienceNamespace.on("connect", function (socket) {
    // Set handlers
    socket.on("join", audience.join);
    socket.on("leave", audience.leave);
    socket.on("answer", audience.answer);
    socket.once("disconnecting", audience.disconnecting);

    // Bubble up to audience submodule with `this` bound to `socket`
    audience.connect.apply(socket, arguments);
});


// Event handler for speaker connections
speakerNamespace.on("connect", function (socket) {
    // Set handlers
    socket.on("join", speaker.join);
    socket.on("leave", speaker.leave);
    socket.on("list rooms", speaker.listRooms);
    socket.on("create room", speaker.createRoom);
    socket.on("ask", speaker.ask);
    socket.once("disconnecting", speaker.disconnecting);

    // Bubble up to speaker submodule with `this` bound to `socket`
    speaker.connect.apply(socket, arguments);
});


console.log(`Server is running at ${DEVELOPMENT ? "localhost:8080" : "yourserver.com"}/`);
