import { Server, Socket } from 'socket.io';
import { IEventService } from './Interfaces';
import { Message } from '../Entities/Message';

export class SocketEventService implements IEventService {
  constructor(private socket: Socket, private server: Server) {}

  notifyAll(message: Message): void {
    this.socket.to(message.receiver.socketId).emit('receive-message', message);
    this.socket.emit('receive-message', message);
  }
}
