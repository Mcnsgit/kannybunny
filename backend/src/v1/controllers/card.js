const {  List, Card } = require('../models/index');

exports.create = async (req, res) => {
  const { boardId, listId } = req.params;
  const { title } = req.body;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    const card = await Card.create({
      title,
      list: listId,
      board: boardId,
      position: list.cards ? list.cards.length : 0
    });

    // Update list with new card
    list.cards = list.cards || [];
    list.cards.push(card._id);
    await list.save();

    // Return populated card
    const populatedCard = await Card.findById(card._id);
    res.status(201).json(populatedCard);
  } catch (err) {
    console.error('Error creating card:', err);
    res.status(500).json({ message: 'Server error while creating card.', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get card', error });
  }
};

exports.getAll = async (req, res) => {
  const { listId } = req.params;
  try {
    const cards = await Card.find({ list: listId }).sort('position');
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get cards', error });
  }
};

exports.update = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $set: req.body },
      { new: true } // Return the updated document
    );
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: 'Server error while updating card.', err });
  }
};

exports.updatePosition = async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceIndex,
    destinationIndex,
    
  } = req.body;

  try {
    // Get the card
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Update card's list if moving between lists
    if (resourceList !== destinationList) {
      card.list = destinationList;
    }

    // Update position
    card.position = destinationIndex;
    await card.save();

    // Get all cards in the destination list
    const destinationCards = await Card.find({ list: destinationList });
    
    // Reorder cards in the destination list
    for (let i = 0; i < destinationCards.length; i++) {
      const currentCard = destinationCards[i];
      if (currentCard.id !== cardId) {
        let newPosition = currentCard.position;
        if (currentCard.position >= destinationIndex) {
          newPosition = currentCard.position + 1;
        }
        await Card.findByIdAndUpdate(currentCard.id, { position: newPosition });
      }
    }

    // If moving between lists, reorder cards in source list
    if (resourceList !== destinationList) {
      const sourceCards = await Card.find({ list: resourceList });
      for (let i = 0; i < sourceCards.length; i++) {
        const currentCard = sourceCards[i];
        if (currentCard.position > resourceIndex) {
          await Card.findByIdAndUpdate(currentCard.id, { 
            position: currentCard.position - 1 
          });
        }
      }
    }

    res.status(200).json({ message: 'Card positions updated successfully.' });
  } catch (err) {
    console.error('Error updating card positions:', err);
    res.status(500).json({ 
      message: 'Server error while updating card positions.', 
      error: err.message 
    });
  }
};

exports.delete = async (req, res) => {
  const { cardId } = req.params;
  try {
    const currentCard = await Card.findById(cardId);
    await Card.deleteOne({ _id: cardId });
    const cards = await Card.find({ list: currentCard.list }).sort('position');
    if (!currentCard) {
      return res.status(404).json({ message: 'Card not found.' });
    } 
    for (const key in cards) {
      await Card.findByIdAndUpdate(
        cards[key]._id,
        { $set: { position: key } }
      );
    }
    res.status(200).json({ message: 'Card deleted successfully.' });
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).json({ message: 'Failed to delete card due to server error.' });
  }
};