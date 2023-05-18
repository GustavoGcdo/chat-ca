import { User } from '../Entities/User';
import { IUserRepository } from './Interfaces';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email == email);
  }

  async vinculeToSocket(email: string, socketId: string): Promise<void> {
    const found = this.users.find((user) => user.email == email);
    if (!found) throw new Error('user not found');
    found.socketId = socketId;
  }
}
