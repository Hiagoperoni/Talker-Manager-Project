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
    const regEmail = /\S+@\S+\.\S+/;
    const validEmail = regEmail.test(email);

    if (!email) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
    if (validEmail === false) {
        return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    if (!password) {
        return res.status(400).json({ message: 'O campo "password" é obrigatório' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    gerarToken();
    return res.status(200).json({ token });
});

module.exports = loginRouter;
