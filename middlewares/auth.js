const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = ( req, res, next ) => {
    
    try{
        const token = req.header('allchat-auth-token');
        if( !token ) {
            return res.status(401).send('no toekn provided!');
        }
        const decodedUser = jwt.verify(token, process.env.jwtPrivateKey);
        // if user id of token does not equla to user id of todo information
        req.body.userId = decodedUser._id;
        //combine auth req.body with router req.body to avoid loosing arriving data
        req.body = Object.assign(req.body, decodedUser);
        next();
    }catch ( ex ){
        //throw new Error('Invalid Token');
    }

}