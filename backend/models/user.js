const {DataTypes} = require('sequelize');
const {database} = require('./database');


const User = database.define('User',{
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    }
});

module.exports = User;