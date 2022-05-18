require('dotenv').config()
const { Sequelize } = require('sequelize');

// Initialize Database
let database = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: 'mysql'
});


// Connection to Database
const connect = async () => {
    try {
        await database.authenticate()
        console.log('Connection has been established successfully.')
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = { connect, database }