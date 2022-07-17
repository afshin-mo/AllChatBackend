const express = require('express');
const users = require('../routes/users');
const login  = require('../routes/login');
const auth = require('../middlewares/auth');
const http = require('http');
const  cors  = require('cors');


module.exports = ( app) => {
    app.use(cors({
        origin: 'http://localhost:4200'
    }));
    app.use( express.json());
    app.use('/api/users', users);
    app.use('/api/login', login);
}
