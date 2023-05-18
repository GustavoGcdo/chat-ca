import { User } from '../Entities/User';
import { IUserRepository } from '../services/Interfaces';

type LoginDto = {
  socketId: string;
  email: string;
  name: string;
};

export class Login {
  constructor(private readonly repository: IUserRepository) {}

  async execute(dto: LoginDto) {
    let user = await this.repository.findByEmail(dto.email);
    if (!user) {
      user = new User(dto.email, dto.name, dto.socketId);
      await this.repository.save(new User(dto.email, dto.name, dto.socketId));
    } else {
      await this.repository.vinculeToSocket(dto.email, dto.socketId);
    }
    return user;
  }
}
