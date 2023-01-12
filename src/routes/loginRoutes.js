const express = require('express');
// const path = require('path');
// const { readFile } = require('../utils/fs/readData');

const loginRouter = express.Router();
// const filePath = path.resolve('src', 'talker.json');
const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let token = '';

const gerarToken = () => {
    if (token.length > 2) {
        token = '';
    }
    for (let i = 0; i < 16; i += 1) {
        token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return token;
};

loginRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    gerarToken();
    if (!email || !password) {
        return res.status(401).json({ message: 'Bad Request' });
    }
    return res.status(200).json({ token });
});

module.exports = { loginRouter };
