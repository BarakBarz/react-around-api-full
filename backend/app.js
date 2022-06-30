const bodyParser = require('body-parser');
const express = require('express');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

const cors = require('cors');

const helmet = require('helmet');

const { login, createUser } = require('./controllers/users');
const { auth } = require('./middleware/auth');

const { requestLogger, errorLogger } = require('./middleware/logger');

const centralErrHandler = require('./middleware/entralErrHandler');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use(errorLogger);

app.use(errors());

app.use(centralErrHandler);

app.listen(PORT, () => {
  console.log('running on PORT: ', PORT);
});
