const { Post, User, Comment } = require('../models/index');

const fs = require('fs');

exports.createComment = (req, res, next) => {
  const commentObject = req.file ?
    {
      ...req.body.comment,
      attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body.comment };
  delete commentObject._id;
  const comment = new Comment({
    ...commentObject,
    userId: req.auth.userId,
    /*,likes : 0,
    dislikes : 0,
    usersLiked: [' '],
    usersDisliked: [' ']*/
  });
  comment.save()
    .then(
      (comment) => {
        Comment.findOne({
          where: { id: comment.id },
          include: [
            { model: User, attributes: ['id', 'username'] }
          ]
        })
          .then((commentUser) => {
            res.status(201).json({
              message: 'Comment created !',
              comment: commentUser
            });
          })

      })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

exports.getAllComments = (req, res) => {
  Comment.findAll({
    include: [
      { model: User, attributes: ['id', 'username'] }
    ],
    order: [['createdAt', 'desc']]
  })
    .then(
      (comments) => {
        res.status(200).json(comments);
      })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

exports.getOneComment = (req, res, next) => {
  Comment.findOne(
    { _id: req.params.id }, { model: User, attributes: ['id', 'username'] })
    .then(
      (comment) => {
        res.status(200).json(comment);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
};

exports.modifyComment = (req, res, next) => {
  Comment.findOne({ _id: req.params.id })
    .then(
      (comment) => {
        if (!comment) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (comment.userId !== req.auth.userId && req.auth.isAdmin === false) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        const commentObject = req.file ?
          {
            ...req.body.comment,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          } : { ...req.body };
        if (req.file) {
          const filename = comment.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => { console.log("Image deleted !") })
        };
        Comment.update({ ...commentObject }, {
          where: {
            _id: req.params.id
          }
        })
          .then(() => {
            res.status(201).json({
              message: 'Comment changed !'
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
};

exports.deleteComment = (req, res, next) => {
  Comment.findOne({ where: { id: req.params.id } }, {
    include:
      { model: User, attributes: ['id', 'username'] }
  })
    .then(
      (comment) => {
        if (!comment) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (comment.userId !== req.auth.userId && req.auth.isAdmin === false) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        if (comment.attachment) {
          const filename = comment.attachment.split('/images/')[1];
          fs.unlink(`images/${filename}`)
        };
        comment.destroy({ _id: req.params.id })
          .then((commentUser) => res.status(200).json({
            message: 'Comment deleted !',
            comment: commentUser
          }))
          .catch(error => res.status(400).json({ error }));
      }
    )
    .catch(error => res.status(500).json({ error }));
};