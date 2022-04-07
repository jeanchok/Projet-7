const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
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
  User.findOne({ where: { username: req.body.username } })
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

exports.deleteUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (req.params.id !== req.auth.userId && !req.auth.isAdmin) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        user.destroy()
          .then(() => res.status(200).json({ message: 'User deleted !' }))
          .catch(error => res.status(400).json({ error }))
      })
    .catch(error => {
      res.status(500).json({ error })
    });
};

exports.modifyUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (req.params.id !== req.auth.userId && !req.auth.isAdmin) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        if (req.body.password) {
          bcrypt.hash(req.body.password, 10)
            .then(hash => {
              const userObject = {
                username: req.body.username,
                email: req.body.email,
                password: hash
              }
            });
        } else {
          const userObject = {
            username: req.body.username,
            email: req.body.email
          }
        }
        user.update({ ...userObject }, { where: { id: req.params.id } })
          .then(() => {
            res.status(201).json({
              message: 'Post modified !', userObject
            });
          }
          )
          .catch(
            (error) => {
              res.status(400).json({
                error: error, ...userObject
              });
            }
          );
      })
    .catch(error => {
      res.status(500).json({ error })
    })
};

exports.modifyUserAvatar = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (req.params.id !== req.auth.userId && !req.auth.isAdmin) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        const userAttachment = req.body
        if (user.attachment !== `${req.protocol}://${req.get('host')}/images/UserImage/Default/avatar.png`) {
          userAttachment.attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          const filename = user.attachment.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => { console.log("Image deleted !") })
        } else {
          userAttachment.attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }
        User.update({ attachment: attachment }, { where: { id: req.params.id } })
          .then((res) => {
            res.status(201).json({
              message: 'Username modified !', attachment: res.data.attachment
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
    .catch(error => {
      res.status(500).json({ error })
    }
    );
};

exports.modifyUsername = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (req.params.id !== req.auth.userId && !req.auth.isAdmin) {
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

exports.modifyUserEmail = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (req.params.id !== req.auth.userId && !req.auth.isAdmin) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        User.update({ email: req.body.email }, { where: { id: req.params.id } })
          .then(() => {
            res.status(201).json({
              message: 'Email modified !', email: req.body.email
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
    .catch(error => {
      res.status(500).json({ error })
    }
    );
};

exports.modifyUserPassword = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then(
      (user) => {
        if (!user) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (req.params.id !== req.auth.userId && !req.auth.isAdmin) {
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

exports.getAllUsers = (req, res) => {
  User.findAll({
    attributes: ['id', 'username', 'email']
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