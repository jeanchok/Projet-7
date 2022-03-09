const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const path = require('path');


const {connect} = require('./models/database');
const loadModel = require('./models/index');

connect()
.then (() =>loadModel())
.catch(error => console.log(error));



const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/', (req,res) => res.send('INDEX'));
app.use(bodyParser.json());

app.use('/api/post', postRoutes);

// 
app.use('/api/auth', userRoutes);



module.exports = app;