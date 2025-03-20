

const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors')

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: '*',
        method:['GET', 'POST']
    }
});

app.use(cors());

io.on('connection', (socket) => {
    console.log('A User connected', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);

       
    });
});

app.post("/broadcast", express.json(), (req, res)=> {
    const {user} = req.body;
    io.emit('pendingUser', user);
    res.status(200).json({message: "User broadcastes"});
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log(`webSocket server running on port ${PORT}`);
});