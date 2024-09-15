const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key'; // Change this to a strong secret key

app.use(cors());
app.use(bodyParser.json());

// Mock user data (replace this with a database in a real application)
const users = [
    {
        id: 1,
        email: 'user@example.com',
        password: bcrypt.hashSync('password123', 8), // Hash the password
    },
];

// Login route
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find((u) => u.email === email);
    if (!user) {
        return res.status(404).send({ message: 'User not found.' });
    }

    // Check password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).send({ accessToken: null, message: 'Invalid password!' });
    }

    // Create a token
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours

    res.status(200).send({ id: user.id, email: user.email, token });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});