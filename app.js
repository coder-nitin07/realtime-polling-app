const express = require('express');
const app = express();
const prisma = require('./config/prisma');
const { authRouter } = require('./routes/authRoutes');
const { pollRouter } = require('./routes/pollRoutes');
const { voteRouter } = require('./routes/voteRoutes');
require('./utils/removeExpiredTokens');
require('dotenv').config();

// json middleware
app.use(express.json());

// prisma connection
(async ()=>{
    try {
        await prisma.$connect();
        console.log('Prisma Connected Successfully');
    } catch (err) {
        console.log('Prisma Connetion Failed', err);
    }
})();

// routes
app.use('/auth', authRouter);
app.use('/poll', pollRouter );
app.use('/vote', voteRouter );

app.get('/', (req, res)=>{
    res.send('RealTime Polling Application');
});

module.exports = app;