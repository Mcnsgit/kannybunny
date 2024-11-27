var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

// this is from npx express-generator
const authRouter = require('./auth')
const usersRouter = require('./users')

module.exports = {
  authRouter,
  usersRouter
}

