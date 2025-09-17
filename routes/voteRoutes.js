const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { voteOnPoll } = require('../controllers/voteController');
const voteRouter = express.Router();

voteRouter.post('/:id/vote', authMiddleware, voteOnPoll);

module.exports = { voteRouter };