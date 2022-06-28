const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors/errorHandler');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
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
  console.log(
    'i am the req.user at the end of auth.js + payload after `jwt.verify`: ',
    req.user
  );
  next();
};

module.exports = {
  auth,
};
