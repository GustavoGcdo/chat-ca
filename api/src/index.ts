import express from 'express';
import { createServer } from 'http';
import pino from 'pino';
import { Server } from 'socket.io';
import { SocketEventService } from './services/EventService';
import { InMemoryMessageRepository } from './services/InMemoryMessageRepository';
import { InMemoryUserRepository } from './services/InMemoryUserRepository';
import { GetMessages } from './useCases/GetMessages';
import { Login } from './useCases/Login';
import { SendMessage } from './useCases/SendMessage';
import { AddFriendship } from './useCases/AddUserFriend';
import { InMemoryFriendshipRepository } from './services/InMemoryFriendshipRepository';
const logger = pino({});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const messageRepository = new InMemoryMessageRepository();
const userRepository = new InMemoryUserRepository();
const friendshipRepository = new InMemoryFriendshipRepository();

io.on('connection', (socket) => {
  const eventService = new SocketEventService(socket, io);
  logger.info(`${socket.id} has conectaided`);

  socket.on('login', async (data) => {
    const user = await new Login(userRepository).execute({ ...data, socketId: socket.id });
    io.to(user.socketId).emit('login-success', user);

    new GetMessages(messageRepository).execute().then((messages) => {
      socket.emit('all-messages', messages);
    });
  });

  socket.on('new-message', ({ message, userEmail }) => {
    new SendMessage(eventService, messageRepository, userRepository).execute({
      message,
      userEmail,
    });
  });

  socket.on('add-friendship', async (data) => {
    try {
      await new AddFriendship(userRepository, friendshipRepository).execute(data);
      logger.info(`friendship added ${JSON.stringify(data)}`);
    } catch (error) {
      logger.info(`friendship added error ${(error as Error).toString()}`);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`${socket.id} has disconnect`);
  });
});

const PORT = 3003;
httpServer.listen(PORT, () => {
  logger.info(`[server] > server is runing on port ${PORT}`);
});
