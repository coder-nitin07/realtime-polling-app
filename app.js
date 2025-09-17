const express = require('express');
const app = express();
const prisma = require('./config/prisma');
const { authRouter } = require('./routes/authRoutes');
const { pollRouter } = require('./routes/pollRoutes');
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

app.get('/', (req, res)=>{
    res.send('RealTime Polling Application');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server is running on PORT ', PORT);
});