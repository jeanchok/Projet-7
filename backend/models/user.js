const {DataTypes} = require('sequelize');
const {database} = require('./database');


const User = database.define('User',{
    username : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    isAdmin : {
        type : DataTypes.STRING,
        allowNull : false
    }
});

module.exports = User;