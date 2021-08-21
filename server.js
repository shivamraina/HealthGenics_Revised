const express = require('express');
const app = express();
const config = require('config');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const login = require('./routes/user/login');
const register = require('./routes/user/register');

const db = config.get('mongoURI');

mongoose.connect(db, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected to Database'))
        .catch(err => console.log(err));

if(!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);    
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/user/login', login);
app.use('/api/user/register', register);

app.listen(5000, () => console.log('Server started at port: 5000'));