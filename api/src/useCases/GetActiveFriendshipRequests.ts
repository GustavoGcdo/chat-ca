import { IFriendshipRequestRepository, IUserRepository } from '../services/Interfaces';

type GetActiveFriendshipRequestsDto = {
  receiverEmail: string;
};

export class GetActiveFriendshipRequests {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly friendshipRequestRepo: IFriendshipRequestRepository,
  ) {}

  async execute(dto: GetActiveFriendshipRequestsDto) {
    const userFound = await this.userRepo.findByEmail(dto.receiverEmail);

    if (!userFound) {
      throw new Error('user not found');
    }

    const friendshipRequests = await this.friendshipRequestRepo.getUnrepliedFriendRequests(
      userFound,
    );

    return friendshipRequests;
  }
}
