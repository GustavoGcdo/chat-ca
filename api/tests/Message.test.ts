import { Message } from '../src/Entities/Message';
import { User } from '../src/Entities/User';

test('deve criar um objeto Message sem informar a data', () => {
  const message = new Message({
    text: 'text message',
    sender: new User('email@email.com', 'alguem', 'socketId1'),
    receiver: new User('email2@email.com', 'alguem', 'socketId2'),
  });

  expect(message.text).toBe('text message');
  expect(message.date.getDate()).toBe(new Date().getDate());
});

test('deve criar um objeto Message sem informar a data', () => {
  const messageCreatedAt = new Date();
  const message = new Message({
    text: 'text message',
    sender: new User('email@email.com', 'alguem', 'socketId'),
    receiver: new User('email2@email.com', 'alguem', 'socketId2'),
    date: messageCreatedAt,
  });

  expect(message.text).toBe('text message');
  expect(message.date).toBe(messageCreatedAt);
});

test('nao pode criar mensagem com texto vazio', () => {
  expect(
    () =>
      new Message({
        text: '',
        sender: new User('email@email.com', 'alguem', 'socketId'),
        receiver: new User('email2@email.com', 'alguem', 'socketId2'),
      }),
  ).toThrow('text message is empty');
});

test('nao pode criar mensagem com texto em branco', () => {
  expect(
    () =>
      new Message({
        text: '    ',
        sender: new User('email@email.com', 'alguem', 'socketId'),
        receiver: new User('email2@email.com', 'alguem', 'socketId2'),
      }),
  ).toThrow('text message is empty');
});
