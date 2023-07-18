import { mock } from 'jest-mock-extended';
import { IEventService, IMessageRepository, IUserRepository } from '../src/services/Interfaces';
import { SendMessage } from '../src/useCases/SendMessage';
import { User } from '../src/entities/User';

describe('caso de uso: Nova mensagem', () => {
  let eventService = mock<IEventService>();
  let repository = mock<IMessageRepository>();
  let userRepository = mock<IUserRepository>();

  let useCase = new SendMessage(eventService, repository, userRepository);

  beforeEach(() => {
    eventService.notifyAll.mockReset();
    repository.save.mockReset();
    userRepository.findByEmail.mockReset();

    useCase = new SendMessage(eventService, repository, userRepository);
  });

  test('deve mandar uma mensagem no chat', async () => {
    userRepository.findByEmail.mockResolvedValue(new User('alguem@email', 'alguem', 'idFake'));

    await expect(async () =>
      useCase.execute({
        senderEmail: 'alguem@email.com',
        receiverEmail: 'alguem2@email.com',
        message: 'hello',
      }),
    ).not.toThrowError();
  });

  test('deve emitir a mensagem para todos os usuários ativos', async () => {
    const spy = jest.spyOn(eventService, 'notifyAll');
    userRepository.findByEmail.mockResolvedValue(new User('alguem@email', 'alguem', 'idFake'));

    await useCase.execute({
      senderEmail: 'alguem@email.com',
      receiverEmail: 'alguem2@email.com',
      message: 'hello',
    });

    expect(spy).toBeCalled();
  });

  test('deve salvar a mensagem em um repositorio de dados', async () => {
    const spy = jest.spyOn(repository, 'save');
    userRepository.findByEmail.mockResolvedValue(new User('alguem@email', 'alguem', 'idFake'));

    await useCase.execute({
      senderEmail: 'alguem@email.com',
      receiverEmail: 'alguem2@email.com',
      message: 'hello',
    });

    expect(spy).toBeCalled();
  });

  test('deve falhar ao tentar mandar mensagem caso o usuario não existsa', async () => { 
    userRepository.findByEmail.mockResolvedValue(undefined);

    await expect(useCase.execute({
      senderEmail: 'alguem@email.com',
      receiverEmail: 'alguem2@email.com',
      message: 'hello',
    })).rejects.toThrowError();
   })
});
