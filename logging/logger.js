const winston = require('winston');
require('winston-mongodb');
const dotenv = require('dotenv');
dotenv.config();
const mongooseString = process.env.DB_CONNECTION_STRING;

const logger = winston.createLogger({
    transports: [
        
            new winston.transports.Console(
                {
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
                }
            ),
            new winston.transports.File({filename: 'logging.log'}),
            new winston.transports.MongoDB({
                db: mongooseString,
                options:{ useUnifiedTopology: true },
                level: 'error'
            })
        
    ]
})

module.exports = logger;


