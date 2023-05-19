import { IEventService, IMessageRepository, IUserRepository } from '../services/Interfaces';
import { Message } from '../Entities/Message';

type SendMessageDto = {
  message: string;
  userEmail: string;
};

export class SendMessage {
  constructor(
    private eventService: IEventService,
    private repository: IMessageRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(dto: SendMessageDto) {
    const userFound = await this.userRepository.findByEmail(dto.userEmail);
    if (!userFound) throw new Error('user not found');

    const newMessage = new Message({ text: dto.message, user: userFound });
    await this.repository.save(newMessage);
    this.eventService.notifyAll(newMessage);
  }
}
