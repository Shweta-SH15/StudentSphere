const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword });

        // Remove password before sending response
        const { password: pwd, ...safeUser } = newUser.toObject();
        res.json(safeUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

        // Remove password before sending response
        const { password: pwd, ...safeUser } = user.toObject();

        res.json({ token, user: safeUser });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};
