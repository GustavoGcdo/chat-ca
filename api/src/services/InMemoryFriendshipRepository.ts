import { Friendship } from '../Entities/Friendship';
import { User } from '../Entities/User';
import { IFriendshipRepository } from './Interfaces';

export class InMemoryFriendshipRepository implements IFriendshipRepository {
  private friendships: Friendship[];

  constructor() {
    this.friendships = [];
  }

  async save(friendship: Friendship): Promise<void> {
    this.friendships.push(friendship);
  }

  async getFriends(userEmail: string): Promise<User[]> {
    const friends: User[] = [];

    for (const friendship of this.friendships) {
      if (this.hasFriendship(friendship, userEmail)) {
        if (friendship.receiveUser.email == userEmail) {
          friends.push(friendship.requestUser);
        } else {
          friends.push(friendship.receiveUser);
        }
      }
    }
    return friends;
  }

  private hasFriendship(friendship: Friendship, userEmail: string) {
    return friendship.receiveUser.email == userEmail || friendship.requestUser.email == userEmail;
  }

  public async findFriendship(friendshipToSearch: Friendship): Promise<Friendship | undefined> {
    const asRequester = this.friendships.find(
      (friendship) =>
        friendship.receiveUser.email == friendshipToSearch.receiveUser.email &&
        friendship.requestUser.email == friendshipToSearch.requestUser.email,
    );

    const asReceive = this.friendships.find(
      (friendship) =>
        friendship.receiveUser.email == friendshipToSearch.requestUser.email &&
        friendship.requestUser.email == friendshipToSearch.receiveUser.email,
    );

    return asRequester || asReceive || undefined
  }
}
