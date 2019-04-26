import express from "express";
import SocketIO from "socket.io";
import path from "path";

// Room helper functions
import {makeRoom} from "./room";

// Server-sider sockets code for each context
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
// - Configurable dev and prod ports, currently the same because of
//   using a reverse proxy
const server = app.listen(DEVELOPMENT ? 8080 : 8080);

// Create Socket.io server on express server instance
export const io = SocketIO.listen(server);
// Create namespaces for the audience and speakers
export const audienceNamespace = io.of("/audience");
export const speakerNamespace = io.of("/speaker");


// Make a debugging room if in development mode
// This helps with hot reloaded/synced browsers that autoconnect to a room
if (DEVELOPMENT) {
    makeRoom(
        "TEST",
        {
            committee: "Committee of Debugging",
        },
    );
}


// Event handler for audience member connections
audienceNamespace.on("connect", function (socket) {
    // Room handlers
    socket.on("join", audience.join);
    socket.on("leave", audience.leave);

    // Interaction handlers
    socket.on("raise placard", audience.raisePlacard);
    socket.on("lower placard", audience.lowerPlacard);
    socket.on("vote", audience.vote);

    // Disconnection handler
    socket.once("disconnecting", audience.disconnecting);

    // Bubble up to audience submodule with `this` bound to `socket`
    audience.connect.apply(socket, arguments);
});


// Event handler for speaker connections
speakerNamespace.on("connect", function (socket) {
    // Room handlers
    socket.on("list rooms", speaker.listRooms);
    socket.on("create room", speaker.createRoom);
    socket.on("join", speaker.join);
    socket.on("leave", speaker.leave);

    // Interaction handlers
    socket.on("start voting", speaker.startVoting);
    socket.on("end voting", speaker.endVoting);
    socket.on("lower placard", speaker.lowerPlacard);

    // Disconnection handler
    socket.once("disconnecting", speaker.disconnecting);

    // Bubble up to speaker submodule with `this` bound to `socket`
    speaker.connect.apply(socket, arguments);
});


// eslint-disable-next-line no-console
// TODO: change back to localhost
// TODO: use relative URL for development when I remove browsersync
console.log(`Server is running at ${DEVELOPMENT ? "localhost:8080" : "poll.tritonmun.org"}/`);
