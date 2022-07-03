require('dotenv').config();

const bodyParser = require('body-parser');

const cors = require('cors');

const express = require('express');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const helmet = require('helmet');

const rateLimit = require('express-rate-limit');

const { NODE_ENV } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const { login, createUser } = require('./controllers/users');
const { auth } = require('./middleware/auth');

const { requestLogger, errorLogger } = require('./middleware/logger');

const centralErrHandler = require('./middleware/entralErrHandler');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(limiter);

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(helmet());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

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

if (NODE_ENV !== 'test')
  app.listen(PORT, () => {
    console.log('running on PORT: ', PORT);
  });
