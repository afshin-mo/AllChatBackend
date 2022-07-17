const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user.model');


router.post('/', async ( req, res ) => {

    const { error } = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ email: req.body.email });
    if ( !user ){
        return res.status(400).send('Incorrect username or password');
    }
// bcrypt.compare(first item unhashed pass, hashed pass)
    const validPassword = await bcrypt.compare( req.body.password, user.password);
    if( !validPassword ){
        return res.status(400).send('Incorrect username or password');
    }

    const token = user.generateAuthToken();
    res.status(200).send({"token":token});
})

const validate = ( loginData ) => {
    const schema = Joi.object({
        email: Joi.string().min(7).max(255).email().required(),
        password: Joi.string().min(3).max(1024).required()
    });
    return schema.validate( loginData );
}



module.exports = router ;