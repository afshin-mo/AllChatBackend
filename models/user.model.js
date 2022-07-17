const mongoose = require ('mongoose');
const Joi = require('joi');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const userSchema = mongoose.Schema({
    name:{
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email:{
        type: String,
        minlength: 7,
        maxlength: 255,
        required: true,
        unique: true
    },
    password:{
        type: String,
        minlength: 3,
        maxlength: 1024,
        required: true
    }
});

userSchema.methods.generateAuthToken = function(){
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const token = jwt.sign({ _id: this._id, email: this.email, expireDate: tomorrow }, process.env.jwtPrivateKey);
    console.log(Date.now(), '--', tomorrow);
    return token;
}

const User = mongoose.model('User', userSchema);

const validateUser = ( user ) =>{
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(7).max(255).email().required(),
        password: Joi.string().min(3).max(1024).required()
    });
    return schema.validate( user );
}
exports.User = User;
exports.validate = validateUser;



