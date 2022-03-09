const {DataTypes} = require('sequelize');
const {database} = require('./database');


const Post = database.define('Post',{
    title : {
        type : DataTypes.STRING,
        allowNull : false
    },
    content : {
        type : DataTypes.STRING,
        allowNull : false
    },
    attachment : {
        type : DataTypes.STRING,
    }
});

module.exports = Post;