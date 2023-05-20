import { Friendship } from '../Entities/Friendship';
import { IUserRepository } from '../services/Interfaces';

type AddUserFriendDto = {
  userEmail: string;
  userFriendEmail: string;
};

export class AddUserFriend {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: AddUserFriendDto) {
    const requestUser = await this.userRepository.findByEmail(dto.userEmail);
    const receiveUser = await this.userRepository.findByEmail(dto.userFriendEmail);

    if (!receiveUser) {
      throw new Error('user not found');
    }

    if (!requestUser) {
      throw new Error('friend user not found');
    }

    return new Friendship({
      requestUser,
      receiveUser,
    });
  }
}
