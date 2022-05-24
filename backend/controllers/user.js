const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');

// SignUp controller
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
      user.save()
        .then(() => res.status(201).json({ message: 'User created !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Login controller
exports.login = (req, res, next) => {
  User.findOne({ where: { username: req.body.username } })
    .then(user => {
      if (!user) {
        return res.status(400).json({ error: 'User not find !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Invalid password !' });
          }
          res.status(200).json({
            userId: user.id,
            isAdmin: user.isAdmin,
            token: jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              `${process.env.TOKEN_KEY}`,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Delete user controller
exports.deleteUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (user.id !== req.auth.userId && !req.auth.isAdmin) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        if (user.attachment !== `${req.protocol}://${req.get('host')}/images/UserImage/Default/avatar.png`) {
          const filename = user.attachment.split('/images/UserImage/Updated/')[1];
          fs.unlink(`images/UserImage/Updated/${filename}`, () => { console.log("Image deleted !") })
        }
        user.destroy()
          .then(() => res.status(200).json({ message: 'User deleted !' }))
          .catch(error => res.status(400).json({ error }))
      })
    .catch(error => {
      res.status(500).json({ error })
    });
};

// Modify user Avatar controller
exports.modifyUserAvatar = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (user.id !== req.auth.userId) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        let newAttachment;
        if (user.attachment !== `${req.protocol}://${req.get('host')}/images/UserImage/Default/avatar.png`) {
          newAttachment = `${req.protocol}://${req.get('host')}/images/UserImage/Updated/${req.file.filename}`;
          const filename = user.attachment.split('/images/UserImage/Updated/')[1];
          fs.unlink(`images/UserImage/Updated/${filename}`, () => { console.log("Image deleted !") })
        }
        newAttachment = `${req.protocol}://${req.get('host')}/images/UserImage/Updated/${req.file.filename}`;
        User.update({ attachment: newAttachment }, { where: { id: req.params.id } })
          .then(() => {
            res.status(201).json({
              message: 'User avatar updated !', newAttachment
            });
          })
          .catch(
            (error) => {
              res.status(400).json({
                error: error, newAttachment
              });
            }
          );
      }
    )
    .catch(error => {
      res.status(500).json({ error })
    }
    );
};

// Modify user name controller
exports.modifyUsername = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (user.id !== req.auth.userId) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        User.update({ username: req.body.username }, { where: { id: req.params.id } })
          .then(() => {
            res.status(201).json({
              message: 'Username modified !', username: req.body.username
            });
          }
          )
          .catch(
            (error) => {
              res.status(400).json({
                error: error, username: req.body.username
              });
            }
          );
      }
    )
    .catch(error => {
      res.status(500).json({ error })
    }
    );
};

// Modify user email controller
exports.modifyUserEmail = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (user.id !== req.auth.userId) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        User.update({ email: req.body.email }, { where: { id: req.params.id } })
          .then(() => {
            res.status(201).json({
              message: 'Email modified !',
              email: req.body.email
            });
          })
          .catch(
            (error) => {
              res.status(400).json({
                error: error
              });
            }
          );
      }
    )
    .catch(
      (error) => {
        res.status(500).json({ error })
      }
    );
};

// Modify user password controller
exports.modifyUserPassword = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (user.id !== req.auth.userId) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
            const userPassword = hash;
            User.update({ password: userPassword }, { where: { id: req.params.id } })
              .then(() => {
                res.status(201).json({
                  message: 'Username modified !'
                });
              }
              )
              .catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );
          }
          )
      }
    )
    .catch(error => {
      res.status(500).json({ error })
    }
    );
};

// Get one user controller
exports.getUser = (req, res, next) => {
  User.findOne(({ where: { id: req.params.id } }), {
    attributes: ['id', 'username', 'email']
  })
    .then(
      (user) => {
        res.status(200).json(user);
      }
    )
    .catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
};

// Get all users controller
exports.getAllUsers = (req, res) => {
  User.findAll({
    attributes: ['id', 'username', 'email', 'isAdmin']
  })
    .then(
      (users) => {
        res.status(200).json(users);
      })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};