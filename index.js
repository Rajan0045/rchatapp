const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT || 8000;

const users = {};

app.use(cors());

app.get("/", (req, res) => {
    res.send("Working.......");
});

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket) => {
    console.log("New connection established");

    socket.on("Joined", ({ user }) => {
        try {
            users[socket.id] = user;
            console.log(user, "has joined");
            socket.broadcast.emit("userJoined", { user: "Admin", message: `${user} has joined` });
            socket.emit("welcome", { user: "Admin", message: `Welcome to the chat, ${user}` });
        } catch (err) {
            console.error("Error handling 'Joined' event:", err);
        }
    });

    socket.on("message", ({ message, id }) => {
        try {
            io.emit("sendMessage", { user: users[id], message, id });
        } catch (err) {
            console.error("Error handling 'message' event:", err);
        }
    });

    socket.on("disconnect", () => {
        try {
            const user = users[socket.id];
            socket.broadcast.emit("leave", { user: "Admin", message: `${user} has left` });
            delete users[socket.id];
        } catch (err) {
            console.error("Error handling 'disconnect' event:", err);
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
