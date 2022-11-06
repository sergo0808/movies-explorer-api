const router = require('express').Router();

const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');
const {
  movieValidate,
  movieIdValidate,
} = require('../middlewares/validation');

router.get('/', getMovie); // Get all cards
router.post('/', movieValidate, createMovie); // Create new card
router.delete('/:movieId', movieIdValidate, deleteMovie); // Delete card by ID

module.exports = router;
