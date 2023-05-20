import { Friendship } from '../Entities/Friendship';
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

    await this.friendshipRepository.save(newFriendship);
  }
}
