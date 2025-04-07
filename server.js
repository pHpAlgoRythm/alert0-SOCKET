const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Enable CORS for HTTP requests
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

// Create a Socket.IO server with CORS enabled
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on('send', (message) => {
    io.emit('receive', message);
  });

  socket.on('register', (data) => {
    io.emit('PendingUser');
  });

  socket.on('updateResidents', (data) => {
    io.emit('updatedResidents')
  });

  socket.on('emergencyRequest', (data) => {
    io.emit('emergencyRequests')
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(8080, () => {
  console.log("Server running on port 8080");
});