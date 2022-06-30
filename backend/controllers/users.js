const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
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
      throw new ConflictError('A user with this email already exist');
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
  } catch (err) {
    next(err);
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
    if (!updatedAvatar) {
      throw new NotFoundError('No user with such id');
    }
    res.send(updatedAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('You have submitted invalid data'));
      return;
    } else if (err.name === 'CastError') {
      next(new BadRequestError('You have submitted invalid data'));
      return;
    }

    next(e);
  }
};

const getUserData = (req, res, next) => {
  const { _id } = req.user;
  return User.findOne({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('You have submitted invalid data'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please enter email and password');
  }
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      new UnauthorizedError('Incorrect email or password.');
    })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            console.log('password:', password, 'user.password:', user.password);
            throw new UnauthorizedError('Incorrect email or password.');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            { expiresIn: '7d' }
          );
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
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
