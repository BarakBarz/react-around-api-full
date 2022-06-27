const express = require('express');

const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const router = express.Router();
const {
  getUsers,
  getUserById,
  getUserData,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().alphanum().length(24).hex(),
    }),
  }),
  getUserById
);
router.get('/user/me', getUserData);
router.patch('/users/me', updateUser);
router.patch(
  '/users/me/avatar',
  celebrate({
    params: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  updateAvatar
);

module.exports = router;
