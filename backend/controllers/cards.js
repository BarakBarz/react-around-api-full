const { celebrate, Joi } = require('celebrate');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} = require('../errors/errorHandler');
const Card = require('../models/card');
const User = require('../models/user');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (error) {
    console.log('Error happened in getCards', error);
    next;
  }
};

const createCard = async (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  try {
    const user = await User.findById({ _id });
    const newCard = await Card.create({
      name,
      link,
      owner: user,
    });

    if (!newCard) {
      throw new BadRequestError('Invalid Data');
    }

    res.send(newCard);
  } catch (error) {
    console.log(error.name, error);
    if (error.name === 'ValidationError') {
      next(BadRequestError('Invalid User Id'));
      return;
    } else {
      next(error);
    }
  }
};

const deleteCard = async (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  console.log(cardId);

  try {
    const cardById = await Card.findById(cardId);

    const cardOwnerId = cardById.owner.toHexString();

    if (cardOwnerId !== _id) {
      throw new ForbiddenError("Can't delete someone else's card");
    }

    const removeCard = await Card.findByIdAndDelete(cardId);

    if (!removeCard) {
      throw new Error();
    }

    res.status(200).send(cardById);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const newLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: _id } },
      { new: true }
    )
      .populate(['owner', 'likes'])
      .orFail(() => {
        const error = new Error('Invalid cardId');

        error.statusCode = 400;
        throw error;
      });

    res.send(newLike);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Invalid data' });
    }
    if (error.name === 'DocumentNotFoundError') {
      res.status(404).send({ message: 'Card was not found' });
    } else {
      res.status(500).send({ message: 'An error has occurred on the server' });
    }
  }
};

const unlikeCard = async (req, res, next) => {
  try {
    const newLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
      .populate(['owner', 'likes'])
      .orFail(() => {
        const error = new Error('Card was not found');

        error.statusCode = 404;
        throw error;
      });

    res.send(newLike);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Invalid data' });
    }
    if (error.name === 'DocumentNotFoundError') {
      res.status(404).send({ message: 'Card was not found' });
    } else {
      res.status(500).send({ message: 'An error has occurred on the server' });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
