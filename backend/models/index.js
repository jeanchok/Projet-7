const Post = require('./Post');
const User = require('./User');
const Comment = require('./Comment');

const loadModel = async () => {
    Post.belongsTo(User);
    Comment.belongsTo(User);
    Comment.belongsTo(Post);

    Post.sync(/*{ alter:true }*/);
    User.sync();
    Comment.sync(/*{ alter:true }*/);

}

module.exports = {loadModel, Post, User, Comment};