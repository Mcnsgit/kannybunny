
const db = require('../db');

// Middleware to check if boardId exists
const checkBoardIdExists = async (req, res, next) => {
    const { boardId } = req.params;
    await db.boardExists(boardId)
        .then(exists => {
            if (!exists) return res.status(404).send('Board not found');
            next();
        })
        .catch(err => res.status(500).send(err.message));
};
const checkListIdExists = async (req, res, next) => {
    const { listId } = req.params;
    await db.listExists(listId)
        .then(exists => {
            if (!exists) return res.status(404).send('List not found');
            next();
        })
        .catch(err => res.status(500).send(err.message));
}
// Middleware to check if cardId exists
const checkCardIdExists = async (req, res, next) => {
    const { cardId } = req.params;
    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).send('Card not found');
        }
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    checkBoardIdExists,
    checkListIdExists,
    checkCardIdExists
}

