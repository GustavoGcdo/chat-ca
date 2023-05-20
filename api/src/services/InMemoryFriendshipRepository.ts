import { Friendship } from '../Entities/Friendship';
import { IFriendshipRepository } from './Interfaces';

export class InMemoryFriendshipRepository implements IFriendshipRepository {
  private friendship: Friendship[];

  constructor() {
    this.friendship = [];
  }

  async save(friendship: Friendship): Promise<void> {
    this.friendship.push(friendship);
  }
}
