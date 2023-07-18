import { User } from '../entities/User';
import { IFriendshipRepository } from '../services/Interfaces';

type GetFriendsDto = { userEmail: string };

export class GetFriends {
  constructor(private readonly friendshipRepository: IFriendshipRepository) {}

  async execute(dto: GetFriendsDto) {
    const friends = await this.friendshipRepository.getFriends(dto.userEmail);
    return friends;
  }
}
