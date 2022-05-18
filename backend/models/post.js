const { DataTypes } = require('sequelize');
const { database } = require('./database');

// Initialize Model Post
const Post = database.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    attachment: {
        type: DataTypes.STRING,
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
});

module.exports = Post;