const { celebrate, Joi } = require('celebrate');
const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});

    res.send(cards);
  } catch (error) {
    console.log('Error happened in getCards', error);
    res.status(500).send({ message: 'Requested resource not found' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const newCard = await Card.create({
      name,
      link,
      owner: req.user._id,
    });
    res.send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Invalid User Id' });
    } else {
      res.status(500).send({ message: 'Something went wrong' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const cardById = await Card.findByIdAndRemove({ _id: req.params.cardId });
    if (!cardById) {
      res.status(404).send({ message: 'Card ID not found' });
    }

    res.send(cardById);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Invalid Data' });
    } else {
      console.log('Error happened in deleteCard', error);
      res.status(500).send({ message: 'An error has occurred on the server' });
    }
  }
};

const likeCard = async (req, res) => {
  console.log(req.user._id);
  try {
    const newLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
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

const unlikeCard = async (req, res) => {
  console.log(req.user._id);
  try {
    const newLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
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
