const router = require('express').Router();

const {
  getUsers, updUsers,
} = require('../controllers/users');
const {
  userValidate,
} = require('../middlewares/validation');

router.get('/me', getUsers); // Get all users

router.patch('/me', userValidate, updUsers); // Update user profile

module.exports = router;
