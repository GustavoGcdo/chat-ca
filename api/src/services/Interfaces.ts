import { Message } from '../Entities/Message';

export interface IEventService {
  notifyAll(message: Message): void;
}

export interface IMessageRepository {
  save(message: Message): Promise<void>;
  getAll(): Promise<Message[]>;
}
