const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovie = (_, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail,

  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные в методы создания фильма',
          ),
        );
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { moviesId } = req.params;

  Movie.findById(moviesId)
    .orFail(() => {
      throw new NotFoundError(`Фильм с id: ${moviesId} не найдена`);
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(moviesId).then(() => res.send(movie));
      } else {
        throw new ForbiddenError('Нельзя удалять чужой фильм');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError(
            `Передан некорректны id: ${moviesId} в методы удаления фильма`,
          ),
        );
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Фильм с id: ${moviesId} не найдена`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovie, createMovie, deleteMovie,
};
