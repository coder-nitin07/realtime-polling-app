const cron = require('node-cron');
const prisma = require('../config/prisma');

cron.schedule('0 * * * *', async ()=>{
    try {
        const result = await prisma.blacklistedToken.deleteMany({
            where : {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    } catch (err) {
        console.log('Error while cleanup the tokens', err);
    }
});