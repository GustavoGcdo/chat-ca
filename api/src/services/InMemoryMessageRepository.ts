import { IMessageRepository } from './Interfaces';
import { Message } from '../Entities/Message';

export class InMemoryMessageRepository implements IMessageRepository {
  private messages: Message[];

  constructor() {
    this.messages = [];
  }

  async getAll(): Promise<Message[]> {
    return this.messages.map(
      (message) => new Message({ user: message.user, text: message.text, date: message.date }),
    );
  }

  async save(message: Message): Promise<void> {
    this.messages.push(message);
  }
}