// server.js
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
require('dotenv').config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Attach io instance to Express app
app.locals.io = io;

// socket.io logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinPoll', (pollId) => {
    socket.join(`poll_${pollId}`);
    console.log(`Client ${socket.id} joined poll_${pollId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});