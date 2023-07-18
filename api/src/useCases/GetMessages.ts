import { Friendship } from '../entities/Friendship';
import { IMessageRepository, IUserRepository } from '../services/Interfaces';

type GetMessagesDto = { userEmail: string; friendEmail: string };
export class GetMessages {
  constructor(private repository: IMessageRepository, private userRepository: IUserRepository) {}

  async execute(dto: GetMessagesDto) {
    const userFound = await this.userRepository.findByEmail(dto.userEmail);

    if (!userFound) {
      throw new Error('user not found');
    }

    const friendFound = await this.userRepository.findByEmail(dto.friendEmail);
    if (!friendFound) {
      throw new Error('friend not found');
    }

    const messages = await this.repository.getByFriendship(
      new Friendship({
        receiveUser: friendFound,
        requestUser: userFound,
      }),
    );
    
    return messages;
  }
}
