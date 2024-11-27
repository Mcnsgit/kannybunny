const router = require('express').Router({ mergeParams: true })
const { param, body } = require('express-validator')
const cardController = require('../controllers/card');

const { checkBoardIdExists, checkListIdExists, checkCardIdExists } = require('../middlewares/validationMiddleware');

// Create a card
router.post(
  '/',
  param('listId').isMongoId().withMessage('Invalid list ID format'),
  body('title').isString().isLength({ min: 1 }).withMessage('Title must be at least 1 character long'),
  cardController.create
);

// Get a single card
router.get(
  '/:cardId',
  param('cardId').isMongoId().withMessage('Invalid card ID format'),
  cardController.getOne
);

// Get all cards in a list
router.get(
  '/',
  param('listId').isMongoId().withMessage('Invalid list ID format'),
  cardController.getAll
);
// Update a card's details
router.put(
  '/:cardId',
  param('cardId').isMongoId().withMessage('Invalid card ID format'),
  body('title').optional().isString().isLength({ min: 1 }).withMessage('Title must be at least 1 character long'),
  body('description').optional().isString().withMessage('Description must be a string'),
  cardController.update
  );
  
  router.put(
    '/:cardId',
    param('boardId').custom(value => {
      if (!validation.isObjectId(value)) {
        return Promise.reject('invalid board id')
      } else return Promise.resolve()
    }),
    param('cardId').custom(value => {
      if (!validation.isObjectId(value)) {
        return Promise.reject('invalid card id')
      } else return Promise.resolve()
    }),
   
    cardController.update
  )



  router.put(
    '/update-position',
    param('boardId').custom(value => {
      if (!validation.isObjectId(value)) {
        return Promise.reject('invalid board id')
      } else return Promise.resolve()
    }),
  
    cardController.updatePosition
  );
  // router.put(
  //   '/:cardId/update-position',
  //   param('boardId').custom(value => {
  //     if (!validation.isObjectId(value)) {
  //       return Promise.reject('invalid board id')
  //     } else return Promise.resolve()
  //   }),
  
  //   cardController.updatePosition
  // )
// Update a card's position
// router.put(
//   '/update-position',
//   param('boardId').isMongoId().withMessage('Invalid board ID format'),
//   body('newPosition').isNumeric().withMessage('New position must be a number'),
//   cardController.updatePosition
// );


router.delete(
  '/:cardId',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  param('cardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid card id')
    } else return Promise.resolve()
  }),
  cardController.delete
)


// Delete a card
router.delete(
  '/:cardId',
  param('cardId').isMongoId().withMessage('Invalid card ID format'),
  cardController.delete
);

router.get('/:cardId', [checkBoardIdExists, checkListIdExists, checkCardIdExists], cardController.getOne);
router.get('/', [checkBoardIdExists, checkListIdExists], cardController.getAll);
router.put('/:cardId', [checkBoardIdExists, checkListIdExists, checkCardIdExists], cardController.update);
router.patch('/:cardId/position', [checkBoardIdExists, checkListIdExists, checkCardIdExists], cardController.updatePosition);
router.delete('/:cardId', [checkBoardIdExists, checkListIdExists, checkCardIdExists], cardController.delete);

module.exports = router;
