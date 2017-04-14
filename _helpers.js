const bcrypt = require('bcryptjs');
const db = require('./database');

module.exports = {
  createUser: (req) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);
    return db('users')
    .insert({
      username: req.body.username,
      password: hash,
    })
    .returning('*');
  },
  loginRequired: (req, res, next) => {
    if (!req.user) return res.status(401).json({ status: 'Please log in' });
    return next();
  },
};
