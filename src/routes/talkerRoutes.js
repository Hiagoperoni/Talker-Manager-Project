const express = require('express');
const path = require('path');
const { readFile } = require('../utils/fs/readData');
const { writeFile } = require('../utils/fs/writeData');

const talkerRouter = express.Router();
const filePath = path.resolve('src', 'talker.json');
const resultVerify = [0, ''];

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

const verifyNameAndAge = (name, age) => {
    if (!name) {
        resultVerify[0] = 1;
        resultVerify[1] = 'O campo "name" é obrigatório';
    }
    if (name.length < 3) {
        resultVerify[0] = 1;
        resultVerify[1] = 'O "name" deve ter pelo menos 3 caracteres';
    }
    if (!age) {
        resultVerify[0] = 1;
        resultVerify[1] = 'O campo "age" é obrigatório';
    }
    if (age < 18) {
        resultVerify[0] = 1;
        resultVerify[1] = 'A pessoa palestrante deve ser maior de idade';
    }
    return resultVerify;
};

const verifyWatchedAt = (watchedAt) => {
    if (!watchedAt) {
        resultVerify[0] = 1;
        resultVerify[1] = 'O campo "watchedAt" é obrigatório';
    }
    if (watchedAt instanceof !Date) {
        resultVerify[0] = 1;
        resultVerify[1] = 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
    }
    return resultVerify;
};

const verifyRate = (rate) => {
    if (!rate) {
        resultVerify[0] = 1;
        resultVerify[1] = 'O campo "rate" é obrigatório';
    }
    if (rate < 1 || rate > 5 || Number.isInteger(rate)) {
        resultVerify[0] = 1;
        resultVerify[1] = 'O campo "rate" deve ser um inteiro de 1 à 5';
    }
    return resultVerify;
};

const verifyTalk = (talk) => {
    if (!talk) {
        resultVerify[0] = 1;
        resultVerify[1] = 'O campo "talk" é obrigatório';
    }
    return resultVerify;
};

const verifyAuthorization = (authorization) => {
    if (!authorization) {
        resultVerify[0] = 1;
        resultVerify[1] = 'Token não encontrado';
    }
    if (authorization.length < 16 || typeof (authorization) !== 'string') {
        resultVerify[0] = 1;
        resultVerify[1] = 'Token inválido';
    }
    return resultVerify;
};

talkerRouter.post('/talker', async (req, res) => {
    const { authorization } = req.headers;
    const { name, age, talk } = req.body;
    const { watchedAt, rate } = talk;
    verifyAuthorization(authorization);
    verifyNameAndAge(name, age);
    verifyTalk(talk);
    verifyWatchedAt(watchedAt);
    verifyRate(rate);
    const data = await readFile(filePath);
    const id = (data.length + 1) + 1;
    if (resultVerify[0] !== 0) {
        return res.status(400).json({ message: resultVerify[1] });
    }
    const newTalker = { id, name, age, talk: { watchedAt, rate } };
    const writeNewTalker = [...data, newTalker];
    await writeFile(writeNewTalker, filePath);
    res.status(201).json(newTalker);
});

module.exports = talkerRouter;
