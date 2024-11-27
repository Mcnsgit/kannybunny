const mongoose = require('mongoose');
require('dotenv').config();
const Board = require('./models/Board');;
const List = require('../models/list');
const Card = require('../models/card');

const migrateDocuments = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Migrate Boards
        const boards = await Board.find({});
        for (const board of boards) {
            if (!board.boardId) {
                board.boardId = 'board_' + board._id.toString();
            }
            if (!board.metadata) {
                board.metadata = {
                    lastModified: board.updatedAt || new Date(),
                    createdBy: 'system_migration'
                };
            }
            await board.save();
        }
        console.log(`Migrated ${boards.length} boards`);

        // Migrate Lists
        const lists = await List.find({});
        for (const list of lists) {
            if (!list.listId) {
                list.listId = 'list_' + list._id.toString();
            }
            if (!list.metadata) {
                list.metadata = {
                    lastModified: list.updatedAt || new Date(),
                    cardCount: list.cards ? list.cards.length : 0
                };
            }
            if (!list.position) {
                list.position = 0;
            }
            await list.save();
        }
        console.log(`Migrated ${lists.length} lists`);

        // Migrate Cards
        const cards = await Card.find({});
        for (const card of cards) {
            if (!card.cardId) {
                card.cardId = 'card_' + card._id.toString();
            }
            // Fix the list field if it's an array
            if (Array.isArray(card.list)) {
                card.list = card.list[0];
            }
            // Add board reference
            if (!card.board) {
                const parentList = await List.findById(card.list);
                if (parentList) {
                    card.board = parentList.board;
                }
            }
            if (!card.metadata) {
                card.metadata = {
                    createdAt: card.createdAt || new Date(),
                    lastModified: card.updatedAt || new Date(),
                    labels: [],
                    assignedTo: []
                };
            }
            if (!card.position) {
                card.position = 0;
            }
            await card.save();
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
