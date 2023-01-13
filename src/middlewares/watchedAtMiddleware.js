const verifyWaychedAt = (req, res, next) => {
    const { talk } = req.body;
    const { watchedAt } = talk;
    if (!watchedAt) {
        return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
    }
    if ((watchedAt[2] !== '/' || watchedAt[5] !== '/') || watchedAt.length !== 10) {
        return res.status(400)
            .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
    next();
};

module.exports = verifyWaychedAt;