const prisma = require("../config/prisma");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register route
const register = async (req, res)=>{
    try {
       const { name, email, password } = req.body;

       if(!name || !email || !password){
            return res.status(400).json({ message: 'Please fill all the fields' });
       }

       const existingUser = await prisma.user.findUnique({ where: { email } });
       if(existingUser){
            return res.status(400).json({ message: 'Invalid Credentials' });
       }

       const hashedPassword = await bcrypt.hash(password, 10);

       const user = await prisma.user.create({
            data: {
                name, 
                email,
                passwordHash: hashedPassword
            }
       });

       const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
       );

       const { passwordHash: _passwordHash, ...newUser } = user;

       res.status(201).json({ message: 'User created Successfully', user: newUser, token });
    } catch (err) {
        console.log('Server error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// login route
const login = async (req, res)=>{
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const User = await prisma.user.findUnique({ where: { email } });
        if(!User){
            return res.status(400).json({ message: 'User not exist' });
        }

        const comparePassword = await bcrypt.compare(password, User.passwordHash);
        if(!comparePassword){
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const { passwordHash, ...userData } = User;

        const token = jwt.sign(
            { userId: User.id, email: User.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'User Login Successfully', user: userData, token  });
    } catch (err) {
        console.log('Server error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// logout API
const logout = async (req, res)=>{
    try {
        const token = req.token;
        const exp = req.user.exp;

        await prisma.blacklistedToken.create({
            data: {
                token,
                expiresAt: new Date(exp * 1000)
            }
        });

        res.status(200).json({ message: 'Logged Out Successfully', token })
    } catch (err) {
        console.log('Server error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { register, login, logout };