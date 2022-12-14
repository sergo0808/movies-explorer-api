const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovie = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .then((movie) => res.send(movie))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
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
  const { _id } = req.params;

  Movie.findById(_id)
    .orFail(() => {
      throw new NotFoundError(`Фильм с id: ${_id} не найдена`);
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(_id).then(() => res.send({ message: 'фильм удалён' }));
      } else {
        throw new ForbiddenError('Нельзя удалять чужой фильм');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError(
            `Передан некорректны id: ${_id} в методы удаления фильма`,
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovie, createMovie, deleteMovie,
};
