const Post = require('./Post');
const User = require('./User');

const loadModel = async () => {
    Post.belongsTo(User);

    Post.sync(/*{ alter:true }*/);
    User.sync();

}

module.exports = {loadModel, Post, User};