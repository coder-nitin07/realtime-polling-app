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

module.exports = { register };