const bodyParser = require('body-parser');
const express = require('express');

const { celebrate, Joi } = require('celebrate');

const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;
const helmet = require('helmet');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middleware/auth');

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(helmet());

app.use(bodyParser.json());

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log('running on PORT: ', PORT);
});
