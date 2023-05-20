import { Friendship } from '../Entities/Friendship';
import { Message } from '../Entities/Message';
import { User } from '../Entities/User';

export interface IEventService {
  notifyAll(message: Message): void;
}

export interface IMessageRepository {
  save(message: Message): Promise<void>;
  getAll(): Promise<Message[]>;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
  vinculeToSocket(email: string, socketId: string): Promise<void>;
}

export interface IFriendshipRepository {
  getFriends(userEmail: string): Promise<User[]>;
  save(friendship: Friendship): Promise<void>;
  findFriendship(friendship: Friendship): Promise<Friendship | undefined>;
}
