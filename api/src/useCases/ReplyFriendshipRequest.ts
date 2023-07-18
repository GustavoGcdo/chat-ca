import { Friendship } from '../entities/Friendship';
import { FriendshipRequest } from '../entities/FriendshipRequest';
import {
  IFriendshipRepository,
  IFriendshipRequestRepository,
  IUserRepository,
} from '../services/Interfaces';

type ReplyFriendshipRequestDto = {
  requesterEmail: string;
  receiverEmail: string;
  confirm: boolean;
};

export class ReplyFriendshipRequest {
  constructor(
    private userRepository: IUserRepository,
    private friendshipRequestRepository: IFriendshipRequestRepository,
    private friendshipRepository: IFriendshipRepository,
  ) {}

  async execute(dto: ReplyFriendshipRequestDto) {
    const requestUser = await this.userRepository.findByEmail(dto.requesterEmail);
    const receiveUser = await this.userRepository.findByEmail(dto.receiverEmail);

    if (!receiveUser) {
      throw new Error('user not found');
    }

    if (!requestUser) {
      throw new Error('friend user not found');
    }

    const friendshipRequest = new FriendshipRequest({
      requester: requestUser,
      receiver: receiveUser,
      replied: false,
    });
    const friendshipRequestFound = await this.friendshipRequestRepository.find(friendshipRequest);

    if (!friendshipRequestFound) {
      throw new Error('friendshipRequest not found');
    }

    if (dto.confirm) {
      await this.friendshipRepository.save(new Friendship({ requestUser, receiveUser }));
    }

    friendshipRequest.replied = true;
    await this.friendshipRequestRepository.update(friendshipRequest);

    return friendshipRequest;
  }
}
