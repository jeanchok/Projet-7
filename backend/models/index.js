const Post = require('./Post');
const User = require('./User');
const Comment = require('./Comment');
const PostLikes = require('./PostLikes');
const { database } = require('./database');

// Initialize Database Relations
const loadModel = async () => {
    Post.belongsTo(User, { foreignKey: 'userId', onDelete: 'cascade' });
    Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'cascade' });
    Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'cascade' });
    PostLikes.belongsTo(User, { foreignKey: 'userId', onDelete: 'cascade' });
    PostLikes.belongsTo(Post, { foreignKey: 'postId', onDelete: 'cascade' });
    Post.hasMany(PostLikes, { foreignKey: 'postId', onDelete: 'cascade' });

    await database.sync({});
}

module.exports = { loadModel, Post, User, Comment, PostLikes };