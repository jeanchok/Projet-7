const {Post,User,Comment} = require('../models/index');

const fs = require('fs');

exports.createComment = (req, res, next) => {
    console.log(req.body);
    const commentObject = req.body.comment;
    delete commentObject._id;
    const comment = new Comment({
      ...commentObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      /*,likes : 0,
      dislikes : 0,
      usersLiked: [' '],
      usersDisliked: [' ']*/
    });
    comment.save()
    .then(
      () => {
        res.status(201).json({
          message: 'Comment enregistrée !'
        });
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
  Comment.findAll({include : User,Post})
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
  Comment.findOne({
    _id: req.params.id
  }).then(
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

exports.modifyPost = (req, res, next) => {
  Comment.findOne({ _id: req.params.id })
  .then(
    (comment) => {
      if (!comment) {
        res.status(404).json({
          error: new Error('No such Thing!')
        });
      }
      if (comment.userId !== req.auth.userId) {
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }
      const commentObject = req.file ?
        {
          ...req.body.comment,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
      if(req.file){
        const filename = comment.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, ()=> { console.log("Image deleted !")})
      };
      Comment.updateOne({ _id: req.params.id }, { ...commentObject, _id: req.params.id })
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

exports.deletePost = (req, res, next) => {
  Comment.findOne({ _id: req.params.id })
  .then(
    (comment) => {
      if (!comment) {
        res.status(404).json({
          error: new Error('No such Thing!')
        });
      }
      if (comment.userId !== req.auth.userId) {
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }
      Comment.findOne({ _id: req.params.id })
        .then(comment => {
          const filename = comment.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Comment.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Comment deleted !'}))
              .catch(error => res.status(400).json({ error }));
          });
        })
        .catch(error => res.status(500).json({ error }));
    }
  )
};