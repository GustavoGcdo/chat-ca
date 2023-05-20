import { Message } from '../src/Entities/Message';
import { User } from '../src/Entities/User';

test('deve criar um objeto Message sem informar a data', () => {
  const message = new Message({
    text: 'text message',
    user: new User('email@email.com', 'alguem', 'socketId'),
  });

  expect(message.text).toBe('text message');
  expect(message.date.getDate()).toBe(new Date().getDate());
});

test('deve criar um objeto Message sem informar a data', () => {
  const messageCreatedAt = new Date();
  const message = new Message({
    text: 'text message',
    user: new User('email@email.com', 'alguem', 'socketId'),
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
        user: new User('email@email.com', 'alguem', 'socketId'),
      }),
  ).toThrow('text message is empty');
});

test('nao pode criar mensagem com texto em branco', () => {
  expect(
    () =>
      new Message({
        text: '    ',
        user: new User('email@email.com', 'alguem', 'socketId'),
      }),
  ).toThrow('text message is empty');
});
