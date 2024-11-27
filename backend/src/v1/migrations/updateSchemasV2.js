const mongoose = require('mongoose');
require('dotenv').config();
const Board = require('../models/Board');
const List = require('../models/list');
const Card = require('../models/card');

// Disable all validators for this migration
mongoose.set('runValidators', false);

const migrateDocuments = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Migrate Boards
        const boards = await Board.find({}).lean();
        for (const board of boards) {
            const updateData = {
                boardId: 'board_' + board._id.toString(),
                metadata: {
                    lastModified: board.updatedAt || new Date(),
                    createdBy: 'system_migration'
                },
                owner: board.owner || '000000000000000000000000', // Default owner ID
                title: board.title || 'Untitled Board'
            };
            
            await Board.updateOne(
                { _id: board._id },
                { $set: updateData },
                { strict: false }
            );
        }
        console.log(`Migrated ${boards.length} boards`);

        // Migrate Lists
        const lists = await List.find({}).lean();
        for (const list of lists) {
            const updateData = {
                listId: 'list_' + list._id.toString(),
                metadata: {
                    lastModified: list.updatedAt || new Date(),
                    cardCount: list.cards ? list.cards.length : 0
                },
                position: list.position || 0,
                title: list.title || 'Untitled List'
            };
            
            await List.updateOne(
                { _id: list._id },
                { $set: updateData },
                { strict: false }
            );
        }
        console.log(`Migrated ${lists.length} lists`);

        // Migrate Cards
        const cards = await Card.find({}).lean();
        for (const card of cards) {
            // Get the parent list to find the board
            const parentList = await List.findById(card.list).lean();
            
            const updateData = {
                cardId: 'card_' + card._id.toString(),
                list: Array.isArray(card.list) ? card.list[0] : card.list,
                board: parentList ? parentList.board : null,
                metadata: {
                    createdAt: card.createdAt || new Date(),
                    lastModified: card.updatedAt || new Date(),
                    labels: [],
                    assignedTo: []
                },
                position: card.position || 0,
                title: card.title || 'Untitled Card',
                content: card.content || ''
            };
            
            await Card.updateOne(
                { _id: card._id },
                { $set: updateData },
                { strict: false }
            );
        }
        console.log(`Migrated ${cards.length} cards`);

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateDocuments();
