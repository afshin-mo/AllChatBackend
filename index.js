const express = require("express");
const { createServer } = require("http");
const app = express();
const logger = require('./logging/logger');

require('./startup/routes')( app );
require('./startup/database')();

const httpServer = createServer(app);

require('./startup/sockets')( httpServer );

const port = process.env.PORT || 3000;
httpServer.listen(port, ()=> logger.info(`connected to the port number ${port}`));
