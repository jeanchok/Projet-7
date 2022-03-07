const express = require('express');
const bodyParser = require('body-parser');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database_development', 'root', 'hncro', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
.then(()=>
    console.log('Connection has been established successfully.'))
.catch(()=>
    console.log(error))

const app = express();
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(bodyParser.json());

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;