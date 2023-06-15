import { mock } from 'jest-mock-extended';
import { Message } from '../src/Entities/Message';
import { IMessageRepository, IUserRepository } from '../src/services/Interfaces';
import { GetMessages } from '../src/useCases/GetMessages';
import { User } from '../src/Entities/User';

describe('caso de uso: Obter mensagens', () => {
  let repository = mock<IMessageRepository>();
  let userRepository = mock<IUserRepository>();
  let useCase = new GetMessages(repository, userRepository);

  beforeEach(() => {
    repository.getAll.mockReset();
    useCase = new GetMessages(repository, userRepository);
  });

  test('deve obter as mensagens anteriores', async () => {
    const user = new User('user@email.com', 'alguem', 'idFake');
    const friend = new User('friend@email.com', 'alguem', 'idFake2');

    userRepository.findByEmail.mockImplementation(async (email) => {
      if (email == 'user@email.com') {
        return user;
      } else {
        return friend;
      }
    });

    repository.getByFriendship.mockResolvedValue([
      new Message({ sender: user, receiver: friend, text: 'hello' }),
    ]);

    const response = await useCase.execute({
      userEmail: 'user@email.com',
      friendEmail: 'friend@email.com',
    });

    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBe(1);
  });
});
