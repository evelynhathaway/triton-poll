
var express = require('express');
var app = express();

// here we'll store our connections...
var connections = [];
var title = 'Untitled presentation';

app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);



// event handler for when a socket connects
io.sockets.on('connection', function (socket) {

    // when user connects send him title variable content...
    // sending him an object with prop title wich have title variable as content...
    socket.emit('welcome', {
        title : title
    });

    // push to connections array...
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    // disconnect handler...
    socket.once('disconnect', function () {
        connections.splice(connections.indexOf(socket), 1);
        socket.disconnect();
        console.log('Disconnected! %s sockets remaining', connections.length);
    });

});


console.log('Polling server is running at localhost:3000/ ');
