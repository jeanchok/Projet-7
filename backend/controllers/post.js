const {Post,User} = require('../models/index');


const fs = require('fs');

// exports.createPost = (req, res, next) => {
//     const postObject = JSON.parse(req.body.post);
//     delete postObject._id;
//     const post = new Post({
//       ...postObject,
//       //imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     });
//     post.save()
//     .then(
//       () => {
//         res.status(201).json({
//           message: 'Post enregistrée !'
//         });
//       })
//     .catch(
//       (error) => {
//         res.status(400).json({
//           error: error
//         });
//       }
//     );
// };

exports.getAllPosts = (req, res) => {
    Post.findAll({include : User})
    .then(
      (posts) => {
        console.log(posts);
        res.sendStatus(200);
      })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

