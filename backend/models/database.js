require('dotenv').config()
const { Sequelize } = require('sequelize');
let database = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: 'mysql'
});



const connect = async () => {
    

    try {
        await database.authenticate()
        console.log('Connection has been established successfully.')
    }
    catch (error){
        console.log(error)
    }

}

module.exports = {connect,database}