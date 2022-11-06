const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${_id} не найден`);
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя'));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Пользователь c id: ${_id} не найден`));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,

    }))
    .then((user) => {
      res.status(201).send({
        data: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные в методы создания пользователя',
          ),
        );
      } else if (err.code === 11000) {
        next(
          new ConflictError(
            'Пользователь с таким электронным адресом уже существует',
          ),
        );
      } else {
        next(err);
      }
    });
};

const updUsers = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError(`пользователь c id: ${req.user._id} не найден`);
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные в методы обновления профиля',
          ),
        );
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Пользователь c id: ${req.user._id} не найден`));
      } else {
        next(err);
      }
    });
};
module.exports = {
  updUsers, createUser, login, getCurrentUser,
};
