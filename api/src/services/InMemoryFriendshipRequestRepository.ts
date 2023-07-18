import { FriendshipRequest } from '../entities/FriendshipRequest';
import { User } from '../entities/User';
import { IFriendshipRequestRepository } from './Interfaces';

export class InMemoryFriendshipRequestRepository implements IFriendshipRequestRepository {
  private friendshipRequest: FriendshipRequest[];

  constructor() {
    this.friendshipRequest = [];
  }

  async save(friendshipRequest: FriendshipRequest): Promise<void> {
    this.friendshipRequest.push(friendshipRequest);
  }

  async find(friendshipRequest: FriendshipRequest): Promise<FriendshipRequest | undefined> {
    return this.friendshipRequest.find(
      (f) =>
        f.receiver.email == friendshipRequest.receiver.email &&
        f.requester.email == friendshipRequest.requester.email &&
        f.replied == friendshipRequest.replied,
    );
  }

  async update(friendshipRequest: FriendshipRequest): Promise<void> {
    const friendshipRequestFound = this.friendshipRequest.find(
      (f) =>
        f.receiver.email == friendshipRequest.receiver.email &&
        f.requester.email == friendshipRequest.requester.email &&
        f.replied == false,
    );

    if (friendshipRequestFound) {
      friendshipRequestFound.replied = true;
    }
  }

  async getUnrepliedFriendRequests(userReceiver: User): Promise<FriendshipRequest[]> {
    console.log('buscando amizades para', userReceiver.email);
    
    return this.friendshipRequest.filter(
      (f) => f.receiver.email == userReceiver.email && f.replied == false,
    );
  }
}
