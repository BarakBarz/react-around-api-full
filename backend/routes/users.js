const { celebrate, Joi } = require('celebrate');

const express = require('express');

const { isURLValid } = require('../utils/constants');

const router = express.Router();
const {
  getUsers,
  getUserById,
  getUserData,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUserData);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().alphanum().length(24).hex(),
    }),
  }),
  getUserById
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required(isURLValid),
    }),
  }),
  updateAvatar
);

module.exports = router;
