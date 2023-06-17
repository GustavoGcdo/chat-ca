import { FriendshipRequest } from '../Entities/FriendshipRequest';
import { IFriendshipRequestRepository, IUserRepository } from '../services/Interfaces';

type RequestFriendshipDto = {
  requesterEmail: string;
  receiverEmail: string;
};

export class RequestFriendship {
  constructor(
    private userRepository: IUserRepository,
    private friendshipRequestRepository: IFriendshipRequestRepository,
  ) {}

  async execute(dto: RequestFriendshipDto) {
    const requestUser = await this.userRepository.findByEmail(dto.requesterEmail);
    const receiveUser = await this.userRepository.findByEmail(dto.receiverEmail);

    if (!receiveUser) {
      throw new Error('user not found');
    }

    if (!requestUser) {
      throw new Error('friend user not found');
    }

    const newFriendshipRequest = new FriendshipRequest({
      requester: requestUser,
      receiver: receiveUser,
      replied: false,
    });

    await this.friendshipRequestRepository.save(newFriendshipRequest);

    return newFriendshipRequest;
  }
}
