const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createPoll, updatePoll, getAllPoll, getPollById } = require('../controllers/pollController');
const pollRouter = express.Router();

pollRouter.post('/create', authMiddleware, createPoll);
pollRouter.put('/:id', authMiddleware, updatePoll);
pollRouter.get('/getPolls', authMiddleware, getAllPoll);
pollRouter.get('/:id', authMiddleware, getPollById);

module.exports = { pollRouter };