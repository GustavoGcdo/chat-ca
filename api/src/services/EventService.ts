import { Server, Socket } from 'socket.io';
import { IEventService } from './Interfaces';
import { Message } from '../Entities/Message';

export class SocketEventService implements IEventService {
  constructor(private socket: Socket, private server: Server) {}

  notifyAll(message: Message): void {
    this.server.emit('receive-message', message);
  }
}
