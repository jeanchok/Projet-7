const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
    const user = new User({
        isAdmin: false,
        username: req.body.username,
        email: req.body.email,
        password: hash
    });
    user.save()
        .then(() => res.status(201).json({ message: 'User created !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email } || { username: req.body.username })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'User not find !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Invalid password !' });
            }
            res.status(200).json({
              userId: user.id,
              token: jwt.sign(
                { userId: user.id },
                `${process.env.TOKEN_KEY}`,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

exports.deleteUser = (req, res, next) => {
  User.findOne({ email: req.body.email } || { username: req.body.username })
    .then(
      (user) => {
        user.destroy({ _id: user.id })
          .then(() => res.status(200).json({ message: 'User deleted !'}))
          .catch(error => res.status(400).json({ error }));
      })
    .catch(error => res.status(500).json({ error }));
};