const { comment, User, Comment } = require('../models/index');

const fs = require('fs');

// Create a new comment for a post
exports.createComment = (req, res, next) => {
  const commentObject = req.file ?
    {
      ...req.body,
      attachment: `${req.protocol}://${req.get('host')}/images/ForumImages/${req.file.filename}`
    } : req.body;
  delete commentObject._id;
  const comment = new Comment({
    ...commentObject,
    userId: req.auth.userId,
  });
  comment.save()
    .then(
      (comment) => {
        Comment.findOne({
          where: { id: comment.id },
          include: [
            { model: User, attributes: ['id', 'username', 'attachment'] }
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

// Get all comments for a post
exports.getAllComments = (req, res) => {
  Comment.findAll({
    include: [
      { model: User, attributes: ['id', 'username', 'attachment'] }
    ],
    order: [['createdAt', 'asc']]
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

// Get one comment for a post
exports.getOneComment = (req, res, next) => {
  Comment.findOne(
    { _id: req.params.id }, { model: User, attributes: ['id', 'username', 'attachment'] })
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

// Update a comment for a post
exports.modifyComment = (req, res, next) => {
  Comment.findOne({ _id: req.params.id })
    .then(
      (comment) => {
        if (!comment) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (comment.userId !== req.auth.userId && !req.auth.isAdmin) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        const commentObject = req.body;
        if (!comment.attachment) {
          commentObject.attachment = `${req.protocol}://${req.get('host')}/images/ForumImages/${req.file.filename}`;
          const filename = comment.attachment.split('/images/ForumImages/')[1];
          fs.unlink(`images/ForumImages/${filename}`, () => { console.log("Image deleted !") })
        }
        Comment.update({ ...commentObject }, { where: { id: req.params.id } })
          .then(() => {
            res.status(201).json({
              message: 'comment modified !', commentObject
            });
          }
          )
          .catch(
            (error) => {
              res.status(400).json({
                error: error, ...commentObject
              });
            }
          );
      }
    )
};

// Delete a comment for a post
exports.deleteComment = (req, res, next) => {
  Comment.findOne({ where: { id: req.params.id } }, {
    include:
      { model: User, attributes: ['id', 'username', 'attachment'] }
  })
    .then(
      (comment) => {
        if (!comment) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (comment.userId !== req.auth.userId && !req.auth.isAdmin) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        if (comment.attachment !== 'null') {
          const filename = comment.attachment.split('/images/ForumImages/')[1];
          fs.unlink(`images/ForumImages/${filename}`, () => { console.log("Image deleted !") });
        }
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