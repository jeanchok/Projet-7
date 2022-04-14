const Post = require('./Post');
const User = require('./User');
const Comment = require('./Comment');
const PostLikes = require('./PostLikes');
const { database } = require('./database');

const loadModel = async () => {
    Post.belongsTo(User, { foreignKey: 'userId', onDelete: 'cascade' });
    Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'cascade' });
    Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'cascade' });
    PostLikes.belongsTo(User, { foreignKey: 'userId', onDelete: 'cascade' });
    PostLikes.belongsTo(Post, { foreignKey: 'postId', onDelete: 'cascade' });
    Post.hasMany(PostLikes, { foreignKey: 'postId', onDelete: 'cascade' });

    // await database.query('SET foreign_key_checks = 0');

    // Post.sync
    // User.sync({ force:true });
    // Comment.sync({ force:true });

    await database.sync(/*{ force: true }*/);
    // await database.query('SET foreign_key_checks = 1');

}

module.exports = { loadModel, Post, User, Comment, PostLikes };