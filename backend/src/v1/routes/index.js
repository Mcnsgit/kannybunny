var express = require('express');
var router = express.Router();
const validationMiddleware = require('../middlewares/validationMiddleware');
// const boardRoutes = require('./board');
// const listRoutes = require('./list');
// const cardRoutes = require('./card');

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/boards', require('./board'))
router.use('/boards/:boardId/lists', require('./list'))
router.use('/boards/:boardId/lists/:listId/cards', require('./card'))
module.exports = router;

