const { celebrate, Joi } = require('celebrate');
const express = require('express');

const router = express.Router();
const { isURLValid } = require('../utils/constants');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

router.get('', getCards);
router.post(
  '',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().required(isURLValid),
    }),
  }),
  createCard
);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', unlikeCard);

module.exports = router;
