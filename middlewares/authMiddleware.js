const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { PrismaClient } = require('@prisma/client');

const authMiddleware = async (req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. Invalid Token." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // checking the token is already blacklisted
        const blacklisted = await prisma.blacklistedToken.findUnique({
            where : { token }
        });
        if(blacklisted){
            return res.status(401).json({ message: 'Token has been blacklisted' });
        }

        req.user = decoded;
        req.token = token;

        next();
    } catch (err) {
        console.log('Auth Error ', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authMiddleware };