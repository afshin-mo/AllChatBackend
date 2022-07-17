const express = require('express');
const { User, validate } = require('../models/user.model');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get( '/', auth, async( req, res ) => {
    const users = await User.find().select('-password');
    if ( !users.length ){
        res.status(200).send('there is no users yet!');
    }else{
        res.status(200).send(users);
    }
});

router.get('/me', auth, async( req, res ) => {
    const user = await  User.findById(req.body._id).select('-password');
    res.status(200).send(user);
})

router.post( '/', async( req, res ) => {
    const { error } = validate( req.body );
    if ( error ) {
        return res.status(400).send(error.details[0].message);
    } 
    let user = await User.findOne({ email: req.body.email });
    if ( user ) {
        return res.status(400).send(' the user already exists!');
    }

    user = new User( _.pick(req.body,[ 'name', 'email', 'password' ]) );
    const salt = await bcrypt.genSalt( 10 );
    user.password = await bcrypt.hash( user.password, salt );
    await user.save();
    const token = user.generateAuthToken();
    res.status(200).header({'allchat-auth-token': token}).send( _.pick( user, ['name', 'email']));

})

module.exports = router;
