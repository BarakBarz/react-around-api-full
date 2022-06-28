const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors/errorHandler');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new UnauthorizedError('Authorization required');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(err);
  }

  req.user = payload;
  console.log(`payload`, payload);
  next();
};

module.exports = {
  auth,
};
