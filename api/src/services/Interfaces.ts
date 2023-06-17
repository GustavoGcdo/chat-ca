import { Friendship } from '../Entities/Friendship';
import { FriendshipRequest } from '../Entities/FriendshipRequest';
import { Message } from '../Entities/Message';
import { User } from '../Entities/User';

export interface IEventService {
  notifyAll(message: Message): void;
}

export interface IMessageRepository {
  save(message: Message): Promise<void>;
  getAll(): Promise<Message[]>;
  getByFriendship(friendship: Friendship): Promise<Message[]>;
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
export interface IFriendshipRequestRepository {
  save(friendshipRequest: FriendshipRequest): Promise<void>;
  find(friendshipRequest: FriendshipRequest): Promise<FriendshipRequest | undefined>;
  update(friendshipRequest: FriendshipRequest): Promise<void>;
  getUnrepliedFriendRequests(userReceiver: User): Promise<FriendshipRequest[]>;
}
