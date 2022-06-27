const { celebrate, Joi } = require('celebrate');

const express = require('express');

const validate = require('validator');

const router = express.Router();
const {
  getUsers,
  getUserById,
  getUserData,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const isURLValid = (value, helpers) => {
  if (
    validate.isURL(value, {
      require_protocol: true,
      allow_underscores: true,
    })
  ) {
    return value;
  }
  return helpers.error('string.uri');
};

router.get('/users', getUsers);

router.get('/user/me', getUserData);

router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().alphanum().length(24).hex(),
    }),
  }),
  getUserById
);

router.patch(
  '/users/me',
  celebrate({
    params: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

router.patch(
  '/users/me/avatar',
  celebrate({
    params: Joi.object().keys({
      avatar: Joi.string().required(isURLValid),
    }),
  }),
  updateAvatar
);

module.exports = router;
