const { Board, List, Card } = require('../models/index');

//create board
exports.create = async (req, res) => {
  try {
    const boardCount = await Board.find().countDocuments()
    const board = await Board.create({
      title: req.body.title,
      description: req.body.description,      position: boardCount > 0 ? boardCount  : 0,
    })
    res.status(201).json(board);
    console.log('Board created');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating board due to server issue' });
  }
};


// Get a  board by ID
exports.getOne = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findOne({ _id: boardId })
    if (!board) return res.status(404).json('Board not found')
    const lists = await List.find({ board: boardId })
  for (const list of lists) {
    const cards = await Card.find({ list: list.id }).populate('list').sort('-position');
    list._doc.cards = cards
  }
  board._doc.lists = lists
    res.status(200).json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting board' });
  }
};


//get all boards

exports.getAll = async (req, res) => {
  try {
    const boards = await Board.find({  board: req.body._id}).sort('-position');
    res.status(200).json(boards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting boards' });
  }
};


// Update board position
exports.updatePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    for( const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(
        board._id,
        { $set: { position: key } }
      )
    }
    res.status(200).json({ message: 'Positions updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating board positions' });
  }
}

// Update a board data
exports.update = async (req, res) => {
  const { boardId } = req.params;
  const { title, description } = req.body;

  try {
    if (title === '') req.body.title = 'Untitled';
    if (description === '') req.body.description = 'Add description here';

    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json('Board not found');

    const updateData = {};
    for (const key in req.body) {
      const value = req.body[key];
      if (value !== undefined) {
        if (key === 'lists' && Array.isArray(value)) {
          updateData.lists = value.sort((a, b) => (b.position || 0) - (a.position || 0));
        } else if (key === 'position') {
          updateData.position = value;
        } else {
          updateData[key] = value;
        }
      }
    }

    const board = await Board.findByIdAndUpdate(boardId, { $set: updateData }, { new: true });
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Update the position of the board based on the most recently used/selected or alphabetical order
    const boards = await Board.find().sort({ updatedAt: -1, title: 1 });
    for (const key in boards) {
      const board = boards[key];
      await Board.findByIdAndUpdate(
        board.id,
        { $set: { position: key } }
      );
    }

    res.status(200).json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating board' });
  }
};

// exports.getFavourites = async (req, res) => {
//   try {
//     const favourites = await Board.find({
//       favourite: true
//     }).sort('-favouritePosition');
//     res.status(200).json(favourites);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports.updateFavouritePosition = async (req, res) => {
//   const { boards } = req.body;
//   try {
//     for (const key in boards.reverse()) {
//       const board = boards[key];
//       awaitBoard.findByIdAndUpdate(board.id, { $set: { favouritePosition: key } });
//     }
//     res.status(200).json('updated');
//     } catch (err) {
//     res.status(500).json(err);
//     }
//     };


// Delete a board
exports.delete = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    await Promise.all([
      List.deleteMany({ board: boardId }),
      Card.deleteMany({ board: boardId }),
      Board.deleteOne({ _id: boardId }),
    ]);

    // Optional: Reorder remaining boards
    // const boards = await Board.find().sort('position');
    // boards.forEach((board, index) => {
    //   board.position = index;
    //   board.save();
    // });

    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting board' });
  }
};
