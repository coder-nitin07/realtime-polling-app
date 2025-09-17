const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createPoll, updatePoll } = require('../controllers/pollController');
const pollRouter = express.Router();

pollRouter.post('/create', authMiddleware, createPoll);
pollRouter.put('/:id', authMiddleware, updatePoll);

module.exports = { pollRouter };