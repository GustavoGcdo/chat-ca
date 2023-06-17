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
import { GetFriends } from './useCases/GetFriends';
import { GetActiveFriendshipRequests } from './useCases/GetActiveFriendshipRequests';
import { InMemoryFriendshipRequestRepository } from './services/InMemoryFriendshipRequestRepository';
import { RequestFriendship } from './useCases/RequestFriendship';
import { ReplyFriendshipRequest } from './useCases/ReplyFriendshipRequest';
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
const friendshipRequestRepository = new InMemoryFriendshipRequestRepository();

io.on('connection', (socket) => {
  const eventService = new SocketEventService(socket, io);
  logger.info(`${socket.id} has conectaided`);

  socket.on('login', async (data) => {
    const user = await new Login(userRepository).execute({ ...data, socketId: socket.id });
    io.to(user.socketId).emit('login-success', user);
  });

  socket.on('get-private-messages', ({ userEmail, friendEmail }) => {
    new GetMessages(messageRepository, userRepository)
      .execute({ userEmail, friendEmail })
      .then((messages) => {
        socket.emit('private-messages', messages);
      });
  });

  socket.on('get-friends', ({ userEmail }) => {
    new GetFriends(friendshipRepository).execute({ userEmail }).then((friends) => {
      socket.emit('all-friends', friends);
    });
  });

  socket.on('new-message', ({ message, userEmail, receiverEmail }) => {
    try {
      new SendMessage(eventService, messageRepository, userRepository).execute({
        message,
        senderEmail: userEmail,
        receiverEmail: receiverEmail,
      });
    } catch (error) {
      logger.info(`new-message error ${(error as Error).toString()}`);
    }
  });

  socket.on('add-friendship', async (data) => {
    try {
      const friendship = await new AddFriendship(userRepository, friendshipRepository).execute(
        data,
      );
      socket.to(friendship.receiveUser.socketId).emit('new-friend', friendship.requestUser);
      socket.emit('new-friend', friendship.receiveUser);

      logger.info(`friendship added ${JSON.stringify(data)}`);
    } catch (error) {
      logger.info(`friendship added error ${(error as Error).toString()}`);
    }
  });

  socket.on('get-all-active-friendship-requests', async ({ userEmail }) => {
    await new GetActiveFriendshipRequests(userRepository, friendshipRequestRepository)
      .execute({ receiverEmail: userEmail })
      .then((friendshipRequests) => {
        socket.emit('all-active-friendship-requests', friendshipRequests);
      });
  });

  socket.on('request-friendship', async ({ userEmail, friendEmail }) => {
    const friendshipRequest = await new RequestFriendship(
      userRepository,
      friendshipRequestRepository,
    ).execute({
      receiverEmail: friendEmail,
      requesterEmail: userEmail,
    });

    socket.emit('new-friendship-request', friendshipRequest);
  });

  socket.on('reply-friendship-request', async ({ userEmail, friendEmail, confirm }) => {
    const useCase = new ReplyFriendshipRequest(
      userRepository,
      friendshipRequestRepository,
      friendshipRepository,
    );

    await useCase.execute({ receiverEmail: userEmail, requesterEmail: friendEmail, confirm });
  });

  socket.on('disconnect', () => {
    logger.info(`${socket.id} has disconnect`);
  });
});

const PORT = 3003;
httpServer.listen(PORT, () => {
  logger.info(`[server] > server is runing on port ${PORT}`);
});
