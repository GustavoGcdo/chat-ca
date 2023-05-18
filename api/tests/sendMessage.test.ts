import { mock } from 'jest-mock-extended';
import { IEventService, IMessageRepository } from '../src/services/Interfaces';
import { SendMessage } from '../src/useCases/SendMessage';

describe('caso de uso: Nova mensagem', () => {
  let eventService = mock<IEventService>();
  let repository = mock<IMessageRepository>();
  let useCase = new SendMessage(eventService, repository);

  beforeEach(() => {
    eventService.notifyAll.mockReset();
    repository.save.mockReset();
    useCase = new SendMessage(eventService, repository);
  });

  test('deve mandar uma mensagem no chat', async () => {
    await expect(async () =>
      useCase.execute({
        userEmail: 'alguem@email.com',
        message: 'hello',
      }),
    ).not.toThrowError();
  });

  test('deve emitir a mensagem para todos os usuários ativos', async () => {
    const spy = jest.spyOn(eventService, 'notifyAll');

    await useCase.execute({
      userEmail: 'alguem@email.com',
      message: 'hello',
    });

    expect(spy).toBeCalled();
  });

  test('deve salvar a mensagem em um repositorio de dados', async () => {
    const spy = jest.spyOn(repository, 'save');

    await useCase.execute({
      userEmail: 'alguem@email.com',
      message: 'hello',
    });

    expect(spy).toBeCalled();
  });
});
