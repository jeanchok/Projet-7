const { Post, User, Comment, PostLikes } = require('../models/index');

const fs = require('fs');
const { parse } = require('path');

exports.createPost = (req, res, next) => {
  const postObject = req.file ?
    {
      ...req.body,
      attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : req.body;

  delete postObject._id;
  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
    likes: 0
  });
  post.save()
    .then(
      () => {
        res.status(201).json({
          message: 'Post enregistrée !'
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

exports.getAllPosts = (req, res) => {
  Post.findAll({
    include: [
      { model: PostLikes },
      { model: User, attributes: ['id', 'username', 'attachment'] },
      { model: Comment, include: [{ model: User, attributes: ['id', 'username', 'attachment'] }] }

    ],
    order: [['createdAt', 'desc']]
  })
    .then(
      (posts) => {
        res.status(200).json(posts);
      })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

exports.getOnePost = (req, res, next) => {
  Post.findOne(({ where: { id: req.params.id } }), {
    include: [
      { model: User, attributes: ['id', 'username'] },
      { model: Comment, include: [{ model: User, attributes: ['id', 'username', 'attachment'] }] },
      { model: PostLikes, attributes: ['userId', 'postId'] }
    ],
    order: [['createdAt', 'desc']]
  })
    .then(
      (post) => {
        res.status(200).json(post);
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

exports.modifyPost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(
      (post) => {
        if (!post) {
          res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (post.userId !== req.auth.userId && !req.auth.isAdmin) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        const postObject = req.body;
        if (req.file) {
          postObject.attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          const filename = post.attachment.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => { console.log("Image deleted !") })
        }
        Post.update({ ...postObject }, { where: { id: req.params.id } })
          .then(() => {
            res.status(201).json({
              message: 'Post modified !', postObject
            });
          }
          )
          .catch(
            (error) => {
              res.status(400).json({
                error: error, ...postObject
              });
            }
          );
      }
    )
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id } }, {
    include: [
      { model: User, attributes: ['id', 'username'] }
    ]
  })
    .then(
      (post) => {
        if (!post) {
          return res.status(404).json({
            error: new Error('No such Thing!')
          });
        }
        if (post.userId !== req.auth.userId && !req.auth.isAdmin) {
          return res.status(401).json({
            error: new Error('Unauthorized request!')
          });
        }
        if (post.attachment !== 'null') {
          const filename = post.attachment.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => { console.log("Image deleted !") });
        }
        post.destroy({ _id: req.params.id })
          .then((postUser) => res.status(200).json({
            message: 'Post deleted !',
            post: postUser
          }))
          .catch(error => res.status(400).json({ error }))
      })

    .catch(error => {
      res.status(500).json({ error })
    })

};

exports.likePost = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        res.status(404).json({
          error: new Error('No such Thing!')
        });
      }
      let newLikes;
      let postLikes;
      switch (like) {

        case true:
          newLikes = post.likes + 1
          Post.update({ likes: newLikes }, { where: { id: req.params.id } })
            .then(() => res.status(200).json({ message: `J'aime` }))
            .catch((error) => res.status(400).json({ error }))
          postLikes = new PostLikes({
            postId: req.params.id,
            userId: req.auth.userId,
          });
          postLikes.save()
          // .then(() => res.status(200).json({ message: `J'aime` }))
          // .catch((error) => res.status(400).json({ error }))
          break;

        case false:
          newLikes = post.likes - 1
          Post.update({ likes: newLikes }, { where: { id: req.params.id } })
            .then(() => res.status(200).json({ message: `J'aime` }))
            .catch((error) => res.status(400).json({ error }))
          PostLikes.findOne({ where: { userId: userId } })
            .then(
              (postLikes) => {
                if (!postLikes) {
                  res.status(404).json({
                    error: new Error('No such Thing!')
                  });
                }
                postLikes.destroy()
                // .then(() => res.status(200).json({ message: 'User deleted !' }))
                // .catch(error => res.status(400).json({ error }))
              })
            .catch(error => {
              res.status(500).json({ error })
            });
          break;

        default:
          console.log(error);
      }
    })
    .catch((error) => res.status(404).json({ error }))
}