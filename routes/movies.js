const router = require('express').Router();

const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');
const {
  movieValidate,
  movieIdValidate,
} = require('../middlewares/validation');

router.get('/', getMovie);
router.post('/', movieValidate, createMovie);
router.delete('/:_id', movieIdValidate, deleteMovie);

module.exports = router;
