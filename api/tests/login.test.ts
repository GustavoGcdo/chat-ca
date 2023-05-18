import { mock } from 'jest-mock-extended';
import { Login } from '../src/useCases/Login';
import { IUserRepository } from '../src/services/Interfaces';
import { User } from '../src/Entities/User';

test('deve fazer cadastro e vincular usuario ao socketId', async () => {
  const repository = mock<IUserRepository>();
  const usecase = new Login(repository);

  repository.findByEmail.mockResolvedValue(undefined);
  const spy = jest.spyOn(repository, 'save');

  await usecase.execute({
    socketId: 'fake',
    email: 'gustavo.gcdo@gmail.com',
    name: 'Gustavo Oliveira',
  });

  expect(spy).toBeCalled();
});

test('deve vincular socketId a um usuario já existente', async () => {
  const repository = mock<IUserRepository>();
  const usecase = new Login(repository);

  repository.findByEmail.mockResolvedValue(new User('gustavo.gcdo@gmail.com', 'Gustavo Oliveira', 'fake2'));
  
  const spyFindEmail = jest.spyOn(repository, 'findByEmail');
  const spyVincular = jest.spyOn(repository, 'vinculeToSocket');
  
  await usecase.execute({
    socketId: 'fake1',
    email: 'gustavo.gcdo@gmail.com',
    name: 'Gustavo Oliveira',
  });

  expect(spyFindEmail).toBeCalled();
  expect(spyVincular).toBeCalledWith('gustavo.gcdo@gmail.com', 'fake1');
});
