const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {
  NotFoundError,
  BadRequestError,
  ConflictError,
} = require('../errors/errorHandler');
const { SALT } = require('../utils/constants');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log('Error happened in getUsers', error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userId }).orFail(() => {
      next(new NotFoundError('User does not exist'));
    });

    res.send(user);
    return;
  } catch (error) {
    console.log(1, error.name);
    if (error.name === 'DocumentNotFoundError') {
      next(new NotFoundError('User does not exist'));
    } else {
      console.log('Error happened in getUserById', error);
      return res.status(500).send({ message: 'Something went wrong' });
    }
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  try {
    const doesEmailExist = await User.findOne({ email });
    if (doesEmailExist) {
      next(new ConflictError('A user with this email already exist'));
      return;
    }
    const hashedPassword = await bcrypt.hash(password, SALT);
    if (hashedPassword) {
      const newUser = await User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      });

      if (!newUser) {
        throw new ConflictError('A user with this email already exist');
      }
      const { _id } = newUser;
      res.status(201).send({
        _id,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email,
      });
    }
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  console.log(name, about, _id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name,
        about,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new NotFoundError('No user with such id');
    }

    res.send(updatedUser);
  } catch {
    next();
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const updatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar,
      },
      { new: true, runValidators: true }
    );
    if (updatedAvatar) res.send(updatedAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Link to avatar not valid' });
    } else {
      console.log('Error happened on updateAvatar', error);
      next();
    }
  }
};

const getUserData = (req, res, next) => {
  const { _id } = req.user;
  return User.findOne({ _id })
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('User not found'));
      }

      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return Promise.reject(
          new BadRequestError('You have submitted invalid data')
        );
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Please enter email and password'));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      console.log('login token received: ', token);
      res.status(200).send({ token });
    })
    .catch((e) => {
      next(e);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getUserData,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
