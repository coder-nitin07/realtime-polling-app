const prisma = require('../config/prisma');

// create poll
const createPoll = async (req, res)=>{
    try {
        const { question, options } = req.body;
        if(!question || !options){
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        if(!Array.isArray(options) || options.length < 2){
            return res.status(400).json({ message: 'Poll must have a question and at least 2 options' });
        }

        const createPoll = await prisma.poll.create({
            data: {
                question,
                creatorId: req.user.userId,
                options: {
                    create: options.map(text=> ({ text }))
                }
            },
            include: { options: true }
        });

        res.status(200).json({ message: 'Poll Created Successfully', poll: createPoll });
    } catch (err) {
        console.log('Server error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createPoll };