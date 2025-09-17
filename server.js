const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
require('dotenv').config();

// create http server
const server = http.createServer(app);

// setUp socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST" ]
    }
});

// socket.io logic
io.on('connection', (scoket)=>{
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on PORT ${ PORT }`);
});