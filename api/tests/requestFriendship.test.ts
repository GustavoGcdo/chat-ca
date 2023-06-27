import { mock } from 'jest-mock-extended';
import { User } from '../src/Entities/User';
import {
  IFriendshipRepository,
  IFriendshipRequestRepository,
  IUserRepository,
} from '../src/services/Interfaces';
import { ReplyFriendshipRequest } from '../src/useCases/ReplyFriendshipRequest';
import { RequestFriendship } from '../src/useCases/RequestFriendship';
import { FriendshipRequest } from '../src/Entities/FriendshipRequest';
import { GetActiveFriendshipRequests } from '../src/useCases/GetActiveFriendshipRequests';
import { Friendship } from '../src/Entities/Friendship';

describe('Solicitação de amizade', () => {
  let userRepo = mock<IUserRepository>();
  const user = new User('user@email.com', 'usuario', 'socket1');
  const friend = new User('friend@email.com', 'Amigo', 'socket2');

  userRepo.findByEmail.mockImplementation(async (email) => {
    if (email == user.email) {
      return user;
    } else {
      return friend;
    }
  });

  test('deve solicitar amizade para um usuario', async () => {
    let requestFriendshipRepo = mock<IFriendshipRequestRepository>();
    let friendshipRepo = mock<IFriendshipRepository>();

    const useCase = new RequestFriendship(userRepo, requestFriendshipRepo, friendshipRepo);

    await useCase.execute({
      requesterEmail: user.email,
      receiverEmail: friend.email,
    });

    expect(requestFriendshipRepo.save).toBeCalled();
  });

  test('deve aceitar a uma solicitacao de amizade', async () => {
    let requestFriendshipRepo = mock<IFriendshipRequestRepository>();
    let friendshipRepo = mock<IFriendshipRepository>();

    requestFriendshipRepo.find.mockImplementationOnce(async (friendshipRequest) => {
      return friendshipRequest;
    });

    const useCase = new ReplyFriendshipRequest(userRepo, requestFriendshipRepo, friendshipRepo);

    await useCase.execute({
      requesterEmail: user.email,
      receiverEmail: friend.email,
      confirm: true,
    });

    expect(friendshipRepo.save).toBeCalled();
  });

  test('deve buscar as solicitacoes de amizade não respondidas', async () => {
    let requestFriendshipRepo = mock<IFriendshipRequestRepository>();

    const friendshipRequest = new FriendshipRequest({
      receiver: user,
      requester: friend,
      replied: false,
    });

    requestFriendshipRepo.getUnrepliedFriendRequests.mockResolvedValue([friendshipRequest]);

    const useCase = new GetActiveFriendshipRequests(userRepo, requestFriendshipRepo);
    const friendshipRequests = await useCase.execute({ receiverEmail: friend.email });

    expect(friendshipRequests.length).toBe(1);
  });

  test('nao deve criar uma solicitacao de amizade caso já seja amigo desse usuario', async () => {
    let requestFriendshipRepo = mock<IFriendshipRequestRepository>();
    const friendshipRepository = mock<IFriendshipRepository>();

    friendshipRepository.findFriendship.mockResolvedValue(
      new Friendship({ receiveUser: friend, requestUser: user }),
    );

    const useCase = new RequestFriendship(userRepo, requestFriendshipRepo, friendshipRepository);

    await expect(() =>
      useCase.execute({
        requesterEmail: user.email,
        receiverEmail: friend.email,
      }),
    ).rejects.toThrowError('Already friendship with this user');
  });
});
