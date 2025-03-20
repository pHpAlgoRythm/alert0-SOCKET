const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Socket } = require('dgram');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin : '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

let clients = [];

io.on('connection', (socket)=> {
    console.log('A user Connected:', socket.id);
    clients.push(socket);

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        clients = clients.filter(client => client !== socket);
    });
});

app.post('/broadcast', (req, res) => {
    try{
        const {user} = req.body;
        if(!user){
            return res.status(400).json({message: 'user data missing'});

        }
        console.log("Broadcasting new user:", user);

        // Emit event to all connected clients
        io.emit('PendingUser', user);

        res.status(200).json({ message: "User broadcasted" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

const PORT =  3000;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});