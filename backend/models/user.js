const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const validate = require('validator');

const { UnauthorizedError } = require('../errors/errorHandler');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  id: {
    type: String,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validate.isURL(v, {
          require_protocol: true,
          allow_underscores: true,
        });
      },
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validate.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Incorrect password or email')
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Incorrect password or email')
          );
        }
        return user;
      });
    })

    .catch(next);
};

module.exports = mongoose.model('user', userSchema);
