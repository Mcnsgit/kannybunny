const List = require('../models/list');
const Card = require('../models/card');
exports.create = async (req, res, next) => {
    const { boardId } = req.params;
    try {
        const list = await List.create({board: boardId})
        list._doc.cards = [];
        console.log(`Created list: ${JSON.stringify(list)}`);
        res.status(201).json(list);
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Server error', error: err});
    }
};

exports.getOne = async (req, res) => {
    console.log('Entering getOne');
    const { listId } = req.params;
    
    try {
        console.log(`Getting list with id ${listId}`);
        const list = await List.findById(listId).populate('cards');
        if (!list) {
            console.log(`List with id ${listId} not found`);
            return res.status(404).json({ error: 'List not found' });
        }
        console.log(`Found list: ${JSON.stringify(list)}`);
        res.status(200).json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAll = async (req, res, next) => {
    console.log('Entering getAll');
    const { boardId } = req.params;

    try {
    console.log(`Getting lists for boardId ${boardId}`);
    const lists = await List.find({ board: boardId });
    console.log(`Found lists: ${JSON.stringify(lists)}`);
    res.status(200).json(lists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.update = async (req, res) => {
    const { listId } = req.params;
    try {
        const list = await List.findByIdAndUpdate(
            listId,
            { $set: req.body },
        );
        list._doc.cards = [];
        console.log(`Updated list: ${JSON.stringify(list)}`);
        res.status(200).json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.delete = async (req, res) => {
    const { listId } = req.params;
    try {
        await Card.deleteMany({ list: listId });
        await List.deleteOne({ _id: listId });
        console.log(`Deleting list: ${listId}`);
        res.status(200).json({ message: 'List deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err});
    }
};
