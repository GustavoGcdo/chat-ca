import { IEventService, IMessageRepository } from '../services/Interfaces';
import { Message } from '../Entities/Message';

type SendMessageDto = {
  message: string;
  userEmail: string;
};

export class SendMessage {
  constructor(private eventService: IEventService, private repository: IMessageRepository) {}

  async execute(dto: SendMessageDto) {
    const newMessage = new Message({ text: dto.message, userEmail: dto.userEmail });
    await this.repository.save(newMessage);
    this.eventService.notifyAll(newMessage);
  }
}
