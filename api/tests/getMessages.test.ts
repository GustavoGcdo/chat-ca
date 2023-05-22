import { mock } from 'jest-mock-extended';
import { Message } from '../src/Entities/Message';
import { IMessageRepository } from '../src/services/Interfaces';
import { GetMessages } from '../src/useCases/GetMessages';
import { User } from '../src/Entities/User';

describe('caso de uso: Obter mensagens', () => {
  let repository = mock<IMessageRepository>();
  let useCase = new GetMessages(repository);

  beforeEach(() => {
    repository.getAll.mockReset();
    useCase = new GetMessages(repository);
  });

  test('deve obter as mensagens anteriores', async () => {
    await repository.getAll.mockResolvedValue([
      new Message({
        sender: new User('alguem@email', 'alguem', 'idFake'),
        receiver: new User('alguem2@email', 'alguem', 'idFake2'),
        text: 'hello',
      }),
    ]);
    const reponse = await useCase.execute();
    expect(Array.isArray(reponse)).toBeTruthy();
  });
});
