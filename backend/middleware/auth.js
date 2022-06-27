const jwt = require('jsonwebtoken');

const { SALT } = require('../utils/constants');

const { UnauthorizedError } = require('../errors/errorHandler');

const auth = (req, res, next) => {
  const { authorization } = rew.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new UnauthorizedError('Authorization required');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SALT);
  } catch (err) {
    throw new UnauthorizedError('Authorization required');
  }

  req.user = payload;

  next();
};

module.exports = {
  auth,
};
