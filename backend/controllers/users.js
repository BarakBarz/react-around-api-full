const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
} = require('../errors/errorHandler');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log('Error happened in getUsers', error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId }).orFail(() => {
      const error = new Error('ivalid data');
      error.statusCode = 400;

      throw error;
    });

    res.send(user);
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      res.status(404).send({ message: 'User does not exist' });
    } else {
      console.log('Error happened in getUserById', error);
      res.status(500).send({ message: 'Something went wrong' });
    }
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  try {
    const doesEmailExist = await User.findOne({ email });
    if (doesEmailExist) {
      return new ConflictError('A user with this email already exist');
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
        return new ConflictError('A user with this email already exist');
      }
      res.status(201).send(newUser);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'User failed to pass validation' });
    }
    console.log('Error happened in createUser', error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};

const updateUser = async (req, res) => {
  const { name, about } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      { new: true, runValidators: true }
    );

    res.send(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .send({ message: 'User was not updated. Requirements not met' });
    } else {
      res.status(500).send({ message: 'Something went wrong' });
    }
  }
};

const updateAvatar = async (req, res) => {
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

const getUserData = (req, res) => {
  const { _id } = req.body;

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

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SALT, { expiresIn: '7d' });

      res.send({ token });
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
