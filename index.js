const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users = new Set();

//get static
app.use(express.static(__dirname + '/public'));

//get view
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//start server
io.on('connection', (socket) => {
    socket.on("new user", (data) => {
        socket.userId = data;
        users.add(data);
        io.emit("new user", [...users]);
    })

    socket.on('disconnect', () => {
        users.delete(socket.userId);
        io.emit("user disconnect", socket.userId);
    });

    socket.on("chat message", function(data) {
        io.emit("chat message", data);
    })

    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data);
    });
});

server.listen(3000, () => {
    console.log('listening on port: 3000');
});