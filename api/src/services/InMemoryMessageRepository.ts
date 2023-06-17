import { Friendship } from '../Entities/Friendship';
import { Message } from '../Entities/Message';
import { IMessageRepository } from './Interfaces';

export class InMemoryMessageRepository implements IMessageRepository {
  private messages: Message[];

  constructor() {
    this.messages = [];
  }

  async getAll(): Promise<Message[]> {
    return this.messages.map(
      (message) =>
        new Message({
          sender: message.sender,
          receiver: message.receiver,
          text: message.text,
          date: message.date,
        }),
    );
  }

  async save(message: Message): Promise<void> {
    this.messages.push(message);
  }

  async getByFriendship(friendship: Friendship): Promise<Message[]> {
    return this.messages.filter(
      (message) =>
        this.isUserMessageToFriend(message, friendship) ||
        this.isFriendMessageToUser(message, friendship),
    );
  }

  private isUserMessageToFriend(message: Message, friendship: Friendship) {
    return (
      message.sender.email == friendship.requestUser.email &&
      message.receiver.email == friendship.receiveUser.email
    );
  }

  private isFriendMessageToUser(message: Message, friendship: Friendship) {
    return (
      message.sender.email == friendship.receiveUser.email &&
      message.receiver.email == friendship.requestUser.email
    );
  }
}
