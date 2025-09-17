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

// update poll
const updatePoll = async (req, res)=>{
    try {
        const pollId = parseInt(req.params.id);
        const { question, options } = req.body;
        if(!question || !options){
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        if(!Array.isArray(options) || options.length < 2){
            return res.status(400).json({ message: 'Poll must have a question and at least 2 options' });
        }

        // check poll exists
        const existingPoll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: { options: true }
        });

        if(!existingPoll){
            return res.status(404).json({ message: 'Poll not found' });
        }

        // check the logged in user is the owner
        if (existingPoll.creatorId !== req.user.userId) {
            return res.status(403).json({ message: 'You are not allowed to update this poll' });
        }

        // delete options
        await prisma.pollOption.deleteMany({
            where: { pollId: pollId }
        });

        // update poll question and options
        const updatedPoll = await prisma.poll.update({
            where: { id: pollId },
            data: {
                question,
                options: {
                    create: options.map((text) => ({ text })),
                }
            },
            include: { options: true }
        });

        res.status(200).json({ message: 'Poll updated successfully', poll: updatedPoll });
    } catch (err) {
        console.log('Server error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// get polls
const getPoll = async (req, res)=>{
    try {
        const userId = req.user.userId;

        const getAllPolls = await prisma.poll.findMany({
            where: { creatorId: userId }
        });
        if(getAllPolls.length === 0){
            return res.status(404).json({ message: 'No Poll Found' });
        }

        res.status(200).json({ message: 'Poll Fetched Successfully', polls: getAllPolls });
    } catch (err) {
        console.log('Server error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createPoll, updatePoll, getPoll };