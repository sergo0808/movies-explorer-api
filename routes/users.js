const router = require('express').Router();

const {
  getCurrentUser, updUsers,
} = require('../controllers/users');
const {
  userValidate,
} = require('../middlewares/validation');

router.get('/me', getCurrentUser); // Get all users

router.patch('/me', userValidate, updUsers); // Update user profile

module.exports = router;
