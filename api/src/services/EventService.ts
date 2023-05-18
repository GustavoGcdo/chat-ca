import { Socket } from 'socket.io';
import { IEventService } from './Interfaces';
import { Message } from '../Entities/Message';

export class SocketEventService implements IEventService {
  constructor(private socket: Socket) {}

  notifyAll(message: Message): void {
    this.socket.broadcast.emit('receive-message', { userEmail: message.userEmail, text: message.text });
  }
}
