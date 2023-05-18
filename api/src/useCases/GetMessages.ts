import { IMessageRepository, IUserRepository } from '../services/Interfaces';

export class GetMessages {
  constructor(private repository: IMessageRepository) {}

  async execute() {    
    const messages = await this.repository.getAll();
    return messages;
  }
}
