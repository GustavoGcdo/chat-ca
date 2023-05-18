import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pino from 'pino';
const logger = pino({});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  /* options */
});

io.on('connection', (socket) => {
  // ...
  logger.info('conectaided');

  socket.on('new-message', ({message}) => {    
    socket.broadcast.emit('receive-message', { sender: socket.id, text:message });
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  logger.info(`[server] > server is runing on port ${PORT}`);
});
