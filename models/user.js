const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: (value) => validator.isEmail(value),
    //   message: 'Неверный формат email',
    // },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    require: true,
    unique: true,
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
