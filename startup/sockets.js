const { createServer } = require("http");
const { Server } = require("socket.io");
const logger = require('../logging/logger');
const dotenv = require('dotenv');

module.exports = ( httpServer ) =>{
    dotenv.config();
    const io = new Server(httpServer, {
        cors: {
          origin: process.env.Remote_Client_Address,
          credentials: true
        }
      });
    
    var sockets = [];
  
    io.on("connection", (socket) => {
    
      logger.info(`${socket.request._query['username']} connected`);
    
      let newSocket = {
        email: socket.request._query['username'],
        socketId: socket.id
      };
      sockets.push(newSocket);
      
      io.emit('new_online_user', (sockets));
    
      socket.on('disconnect', ()=>{
       var disconnectedSocket = sockets.find( s => s.socketId===socket.id );
       sockets = sockets.filter ( s => s.email !== disconnectedSocket.email );
       logger.info(disconnectedSocket.email, ' diconnected');
       io.emit('new_online_user', (sockets));
      })
      
      socket.on('new-message', (message)=>{
        socket.broadcast.to(message.socketId).emit('new-message',(message));
        console.log(`socket with id ${socket.id} said: ${message}`);
      })
    });
}
