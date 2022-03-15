const {Post,User,Comment} = require('../models/index');

const fs = require('fs');

exports.createPost = (req, res, next) => {
  const postObject = req.file ?
  {
    ...req.body.post,
    attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body.post };
    delete postObject._id;
    const post = new Post({
      ...postObject,
      userId: req.auth.userId,
      /*,likes : 0,
      dislikes : 0,
      usersLiked: [' '],
      usersDisliked: [' ']*/
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
  Post.findAll({include : [
    {model:User, attributes:['id','username']},
    {model:Comment, include:User,attributes:['id','username']}
    ],
    order:[['createdAt','desc']]
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
  Post.findOne({include : [
    {model:User, attributes:['id','username']},
    {model:Comment, include:User,attributes:['id','username']}
    ],
    order:[['createdAt','desc']]
  },{_id: req.params.id})
  .then(
    (post) => {
      res.status(200).json(post);
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
  Post.findOne({ _id: req.params.id })
  .then(
    (post) => {
      if (!post) {
        res.status(404).json({
          error: new Error('No such Thing!')
        });
      }
      if (post.userId !== req.auth.userId || req.auth.isAdmin === true) {
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }
      const postObject = req.file ?
        {
          ...req.body.post,
          attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
      if(req.file){
        const filename = post.attachment.split('/images/')[1];
        fs.unlink(`images/${filename}`, ()=> { console.log("Image deleted !")})
      };
      Post.update({ ...postObject }, {
        where: { _id: req.params.id 
        }
      })
      .then(() => {
          res.status(201).json({
            message: 'Post modified !'
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
  console.log(req.params.id);
  Post.findOne({ _id: req.params.id })
  .then(
    (post) => {
      if (!post) {
        res.status(404).json({
          error: new Error('No such Thing!')
        });
      }
      if (post.userId !== req.auth.userId || req.auth.isAdmin === true) {
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }
      Post.findOne({ _id: req.params.id })
        .then(
          (post) => {
            if(post.attachment){
              const filename = post.attachment.split('/images/')[1];
              fs.unlink(`images/${filename}`)
            };
            console.log(post);
            post.destroy({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Post deleted !'}))
              .catch(error => res.status(400).json({ error }));
          })
        .catch(error => res.status(500).json({ error }));
    }
  )
};