const express = require('express');
const router = express.Router({ mergeParams: true });
const { param } = require('express-validator');
const listController = require('../controllers/list');

// Create a new list
router.post(
  '/',
  param('boardId').isMongoId().withMessage('Invalid board ID'),
  listController.create
);

// Update a list by ID
router.put(
  '/:listId',
  param('boardId').isMongoId().withMessage('Invalid board ID'),
  param('listId').isMongoId().withMessage('Invalid list ID'),
  listController.update
);

// Delete a list by ID
router.delete(
  '/:listId',
  param('boardId').isMongoId().withMessage('Invalid board ID'),
  param('listId').isMongoId().withMessage('Invalid list ID'),
  listController.delete
);

// Get all lists for a board
router.get(
  '/',
  param('boardId').isMongoId().withMessage('Invalid board ID'),
  listController.getAll
);

// Get a single list by ID
router.get(
  '/:listId',
  param('boardId').isMongoId().withMessage('Invalid board ID'),
  param('listId').isMongoId().withMessage('Invalid list ID'),
  listController.getOne
);

module.exports = router;

// // routes/listRoutes.js
// const router = require('express').Router({ mergeParams: true });
// const listController = require('../controllers/list');
// const { checkBoardIdExists, checkListIdExists, checkCardIdExists } = require('../middlewares/validationMiddleware');



// router.use('/:listId', checkListIdExists);
// // Define routes
// // router.get('/', listController.getAll);
// // router.post('/:boardId/lists', checkBoardIdExists, listController.create);

// router.get('/', checkBoardIdExists, checkListIdExists, listController.getAll);
// router.get('/:listId', checkBoardIdExists, checkListIdExists, listController.getOne);
// router.post('/', checkBoardIdExists, listController.create);
// router.put('/:listId', checkBoardIdExists, checkListIdExists, listController.update);
// router.delete('/:listId', checkBoardIdExists, checkListIdExists, listController.delete);

// module.exports = router;
