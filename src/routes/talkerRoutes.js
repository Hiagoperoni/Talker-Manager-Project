const express = require('express');
const path = require('path');
const { readFile } = require('../utils/fs/readData');

const talkerRouter = express.Router();
const filePath = path.resolve('src', 'talker.json');

talkerRouter.get('/talker', async (req, res) => {
    const data = await readFile(filePath);
    return res.status(200).json(data);
});

talkerRouter.get('/talker/:id', async (req, res) => {
    const { id } = req.params;
    const data = await readFile(filePath);
    const result = data.find((talker) => talker.id === Number(id));
    if (!result) {
        return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(result);
});

// talkerRouter.post('/talker', async (req, res) => {

// });

module.exports = talkerRouter;
