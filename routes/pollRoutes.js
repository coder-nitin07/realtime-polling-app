const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createPoll } = require('../controllers/pollController');
const pollRouter = express.Router();

pollRouter.post('/create', authMiddleware, createPoll);

module.exports = { pollRouter };