const prisma = require('../config/prisma');
const io = require('../server');

// vote on poll
const voteOnPoll = async (req, res)=>{
    try {
        const pollId = parseInt(req.params.id);
        const { optionId } = req.body;
        const userId = req.user.userId;

        if(!pollId || !optionId){
            return res.status(400).json({ message: 'Poll ID and Option ID are required' });
        }

        // check poll exists
        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: { options: true }
        });
        if(!poll){
            return res.status(404).json({ message: 'Poll not found' });
        }


        // check options of poll
        const options = poll.options.find(opt => opt.id === optionId);
        if(!options){
            return res.status(400).json({ message: 'Option does not belong to this poll' });
        }

        const existingVote = await prisma.vote.findUnique({
            where: {
                 userId_pollOptionId: {
                    userId,
                    pollOptionId: optionId
                }
            }
        });

        if(existingVote){
            return res.status(400).json({ message: 'You have already voted for this option' });
        }

        // create vote
        const userVote = await prisma.vote.create({
            data: {
                userId,
                pollOptionId: optionId
            }
        });

        // fetch updated poll results
        const updatedPoll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: { options: { include: { votes: true } } }
        });

        const results = updatedPoll.options.map(opt => ({
            id: opt.id,
            text: opt.text,
            votes: opt.votes.length
        }));

        // 👇 emit updated results
        io.to(`poll_${pollId}`).emit('pollUpdated', {
            pollId,
            question: updatedPoll.question,
            options: results
        });

        res.status(201).json({ message: 'Vote recorded Successfully', vote: userVote });
    } catch (err) {
        console.error('Vote error:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { voteOnPoll };