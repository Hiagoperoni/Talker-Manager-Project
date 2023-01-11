const express = require('express');
const path = require('path');
const { readFile } = require('../utils/fs/readData');

const talkerRouter = express.Router();
const filePath = path.resolve('src', 'talker.json');

talkerRouter.get('/talker', async (req, res) => {
    const data = await readFile(filePath);
    return res.status(200).json(data);
});

module.exports = talkerRouter;
