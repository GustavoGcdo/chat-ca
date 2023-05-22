import { IEventService, IMessageRepository, IUserRepository } from '../services/Interfaces';
import { Message } from '../Entities/Message';

type SendMessageDto = {
  message: string;
  senderEmail: string;
  receiverEmail: string;
};

export class SendMessage {
  constructor(
    private eventService: IEventService,
    private repository: IMessageRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(dto: SendMessageDto) {
    const senderUserFound = await this.userRepository.findByEmail(dto.senderEmail);
    if (!senderUserFound) throw new Error('senderUser not found');

    const receiverUserFound = await this.userRepository.findByEmail(dto.receiverEmail);
    if (!receiverUserFound) throw new Error('receiverUser not found');

    const newMessage = new Message({
      text: dto.message,
      sender: senderUserFound,
      receiver: receiverUserFound,
    });
    await this.repository.save(newMessage);
    this.eventService.notifyAll(newMessage);
  }
}
