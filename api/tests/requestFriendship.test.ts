import { mock } from 'jest-mock-extended';
import { User } from '../src/entities/User';
import {
  IFriendshipRepository,
  IFriendshipRequestRepository,
  IUserRepository,
} from '../src/services/Interfaces';
import { ReplyFriendshipRequest } from '../src/useCases/ReplyFriendshipRequest';
import { RequestFriendship } from '../src/useCases/RequestFriendship';
import { FriendshipRequest } from '../src/entities/FriendshipRequest';
import { GetActiveFriendshipRequests } from '../src/useCases/GetActiveFriendshipRequests';
import { Friendship } from '../src/entities/Friendship';

describe('Solicitação de amizade', () => {
  let userRepo = mock<IUserRepository>();
  let requestFriendshipRepo = mock<IFriendshipRequestRepository>();
  const user = new User('user@email.com', 'usuario', 'socket1');
  const friend = new User('friend@email.com', 'Amigo', 'socket2');
  const validFriendshipRequest = new FriendshipRequest({
    receiver: user,
    requester: friend,
    replied: false,
  });

  userRepo.findByEmail.mockImplementation(async (email) => {
    if (email == user.email) {
      return user;
    } else {
      return friend;
    }
  });

  beforeEach(() => {
    requestFriendshipRepo.getUnrepliedFriendRequests.mockResolvedValue([]);
  });

  test('deve solicitar amizade para um usuario', async () => {
    let friendshipRepo = mock<IFriendshipRepository>();
    const useCase = new RequestFriendship(userRepo, requestFriendshipRepo, friendshipRepo);

    await useCase.execute({
      requesterEmail: user.email,
      receiverEmail: friend.email,
    });

    expect(requestFriendshipRepo.save).toBeCalled();
  });

  test('deve aceitar a uma solicitacao de amizade', async () => {
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
    requestFriendshipRepo.getUnrepliedFriendRequests.mockResolvedValue([validFriendshipRequest]);

    const useCase = new GetActiveFriendshipRequests(userRepo, requestFriendshipRepo);
    const friendshipRequests = await useCase.execute({ receiverEmail: friend.email });

    expect(friendshipRequests.length).toBe(1);
  });

  test('nao deve criar uma solicitacao de amizade caso já seja amigo desse usuario', async () => {
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

  test('nao deve criar uma solicitacao de amizade com você mesmo', async () => {
    const friendshipRepository = mock<IFriendshipRepository>();
    const useCase = new RequestFriendship(userRepo, requestFriendshipRepo, friendshipRepository);

    await expect(() =>
      useCase.execute({
        requesterEmail: user.email,
        receiverEmail: user.email,
      }),
    ).rejects.toThrowError('You cannot create a friendship request with yourself');
  });

  test('nao deve criar uma solicitacao de amizade caso já tenha solicitado', async () => {
    const friendshipRepository = mock<IFriendshipRepository>();
    requestFriendshipRepo.getUnrepliedFriendRequests.mockResolvedValue([validFriendshipRequest]);
    const useCase = new RequestFriendship(userRepo, requestFriendshipRepo, friendshipRepository);

    await expect(() =>
      useCase.execute({
        receiverEmail: user.email,
        requesterEmail: friend.email,
      }),
    ).rejects.toThrowError('friendship request already sending');
  });
});
