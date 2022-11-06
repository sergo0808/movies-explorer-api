const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestError = require('../errors/BadRequestError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    require: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new BadRequestError('Невалидный e-mail.');
      }
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

});

userSchema.statics.findUserByCredentials = function passwordHashHandler(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный электронный адрес или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неверный электронный адрес или пароль');
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
