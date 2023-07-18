import { Friendship } from '../entities/Friendship';
import { IFriendshipRepository, IUserRepository } from '../services/Interfaces';

type AddFriendshipDto = {
  userEmail: string;
  userFriendEmail: string;
};

export class AddFriendship {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly friendshipRepository: IFriendshipRepository,
  ) {}

  async execute(dto: AddFriendshipDto) {
    if (dto.userEmail == dto.userFriendEmail) {
      throw new Error('you can add yourself as a friend');
    }

    const requestUser = await this.userRepository.findByEmail(dto.userEmail);
    const receiveUser = await this.userRepository.findByEmail(dto.userFriendEmail);

    if (!receiveUser) {
      throw new Error('user not found');
    }

    if (!requestUser) {
      throw new Error('friend user not found');
    }

    const newFriendship = new Friendship({
      requestUser,
      receiveUser,
    });

    const alreadyHaveFriendship = await this.friendshipRepository.findFriendship(newFriendship);
    if (alreadyHaveFriendship) {
      throw new Error('already have friendship with this user');
    }

    await this.friendshipRepository.save(newFriendship);
    return newFriendship;
  }
}
