const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors/errorHandler');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('No Authorization!!!');
    throw new UnauthorizedError('Authorization required');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key'
    );
  } catch (err) {
    console.log('No payload');
    next(err);
  }

  req.user = payload;
  next();
};

module.exports = {
  auth,
};
