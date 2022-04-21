const { DataTypes } = require('sequelize');
const { database } = require('./database');


const User = database.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/i
        }
    },
    attachment: {
        type: DataTypes.STRING,
        defaultValue: 'http://localhost:3008/images/UserImage/Default/avatar.png'
    },
    isAdmin: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = User;