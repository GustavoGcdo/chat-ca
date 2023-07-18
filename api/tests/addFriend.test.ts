import { mock } from 'jest-mock-extended';
import { User } from '../src/entities/User';
import { IFriendshipRepository, IUserRepository } from '../src/services/Interfaces';
import { AddFriendship } from '../src/useCases/AddUserFriend';

test('deve adicionar um amigo a lista de amigos', async () => {
  let userRepo = mock<IUserRepository>();
  let friendshipRepo = mock<IFriendshipRepository>();

  const user = new User('alguem@email.com', 'alguem', 'socket1');
  const userToAddFriend = new User('outrapessoa@email.com', 'Outro Alguem', 'socket2');

  userRepo.findByEmail.mockImplementation(async (email) => {
    if (email == user.email) {
      return user;
    } else {
      return userToAddFriend;
    }
  });

  const useCase = new AddFriendship(userRepo, friendshipRepo);

  await useCase.execute({
    userEmail: user.email,
    userFriendEmail: userToAddFriend.email,
  });

  expect(friendshipRepo.save).toBeCalled();
});

test('nao deve adicionar voce mesmo como amigo', async () => {
  let userRepo = mock<IUserRepository>();
  let friendshipRepo = mock<IFriendshipRepository>();

  const user = new User('alguem@email.com', 'alguem', 'socket1');
  const useCase = new AddFriendship(userRepo, friendshipRepo);

  await expect(useCase.execute({
      userEmail: user.email,
      userFriendEmail: user.email,
    }),
  ).rejects.toThrowError();
});
