const { DataTypes } = require('sequelize');
const { database } = require('./database');

// Initialize Model PostLikes
const PostLikes = database.define('PostLikes', {

});

module.exports = PostLikes;