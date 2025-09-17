const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', authMiddleware, logout);

module.exports = { authRouter };