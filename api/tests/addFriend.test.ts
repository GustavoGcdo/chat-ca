import { mock } from 'jest-mock-extended';
import { Friendship } from '../src/Entities/Friendship';
import { User } from '../src/Entities/User';
import { IUserRepository } from '../src/services/Interfaces';
import { AddUserFriend } from '../src/useCases/AddUserFriend';

test('deve adicionar um amigo a lista de amigos', async () => {
  let userRepo = mock<IUserRepository>();

  const user = new User('alguem@email.com', 'alguem', 'socket1');
  const userToAddFriend = new User('outrapessoa@email.com', 'Outro Alguem', 'socket2');

  userRepo.findByEmail.mockImplementation(async (email) => {
    if (email == user.email) {
      return user;
    } else {
      return userToAddFriend;
    }
  });

  const useCase = new AddUserFriend(userRepo);
  const response = await useCase.execute({
    userEmail: user.email,
    userFriendEmail: userToAddFriend.email,
  });

  expect(response).toBeInstanceOf(Friendship);
  expect(response.requestUser).toBe(user);
  expect(response.receiveUser).toBe(userToAddFriend);
});
