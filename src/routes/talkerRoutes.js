const express = require('express');
const path = require('path');
const { readFile } = require('../utils/fs/readData');
const { writeFile } = require('../utils/fs/writeData');
const authMidd = require('../middlewares/authorizationMiddleware');
const nameAndAgeMidd = require('../middlewares/nameAndAgeMiddleware');
const talkerMidd = require('../middlewares/talkMiddleware');
const rateMidd = require('../middlewares/rateMiddleware');
const watchedAtMidd = require('../middlewares/watchedAtMiddleware');

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

talkerRouter.post('/talker', authMidd, nameAndAgeMidd, 
    talkerMidd, rateMidd, watchedAtMidd, async (req, res) => {
    const { name, age, talk } = req.body;
    const { watchedAt, rate } = talk;
    const data = await readFile(filePath);
    const id = (data.length + 1);
    const newTalker = { 
        id, 
        name, 
        age, 
        talk: { 
            watchedAt, 
            rate },
        };
    data.push(newTalker);
    await writeFile(data, filePath);
    return res.status(201).json(newTalker);
});

talkerRouter.put('/talker/:id', authMidd, nameAndAgeMidd, 
    talkerMidd, rateMidd, watchedAtMidd, async (req, res) => {
    const { name, age, talk } = req.body;
    const { watchedAt, rate } = talk;
    const { id } = req.params;
    const data = await readFile(filePath);
    const result = data.filter((talker) => talker.id !== Number(id));
    const edittedTalker = { id, name, age, talk: { watchedAt, rate } };
    const editTalker = [result, edittedTalker];
    await writeFile(editTalker, filePath);
    return res.status(201).json(edittedTalker);
});

talkerRouter.delete('/talker/:id', authMidd, nameAndAgeMidd, 
    talkerMidd, rateMidd, watchedAtMidd, async (req, res) => {
    const { id } = req.params;
    const data = await readFile(filePath);
    const result = data.filter((talker) => talker.id !== Number(id));
    await writeFile(result, filePath);
    return res.status(204).json();
});

module.exports = talkerRouter;
