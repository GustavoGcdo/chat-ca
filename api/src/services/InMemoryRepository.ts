import { IMessageRepository } from './Interfaces';
import { Message } from '../Entities/Message';

export class InMemoryRepository implements IMessageRepository {
  private messages: Message[];

  constructor() {
    this.messages = [];
  }

  async getAll(): Promise<Message[]> {
    return this.messages.map((message) => new Message(message.sender, message.text));
  }

  async save(message: Message): Promise<void> {
    this.messages.push(message);
  }
}
