import { IEventService, IMessageRepository } from '../services/Interfaces';
import { Message } from '../Entities/Message';

type SendMessageDto = {
  sender: string;
  message: string;
};

export class SendMessage {
  constructor(private eventService: IEventService, private repository: IMessageRepository) {}

  async execute(dto: SendMessageDto) {
    const newMessage = new Message(dto.sender, dto.message);
    await this.repository.save(newMessage);
    this.eventService.notifyAll(newMessage);
  }
}
