import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pino from 'pino';
import { InMemoryRepository } from './services/InMemoryRepository';
import { SocketEventService } from './services/EventService';
import { SendMessage } from './useCases/SendMessage';
import { GetMessages } from './useCases/GetMessages';
const logger = pino({});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const repository = new InMemoryRepository();

io.on('connection', (socket) => {
  const eventService = new SocketEventService(socket);
  logger.info( `${socket.id} has conectaided`);

  new GetMessages(repository).execute().then((messages) => {
    socket.emit('all-messages', messages);
  });

  socket.on('new-message', ({ message }) => {
    new SendMessage(eventService, repository).execute({ message, sender: socket.id });
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  logger.info(`[server] > server is runing on port ${PORT}`);
});
