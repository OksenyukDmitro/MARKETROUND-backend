import faker from 'faker';
import product from './product';
import user from './user';
import message from './message';

const chat = () => ({
  _id: faker.random.uuid(),
  createdAt: faker.date.past(),
  productId: faker.random.uuid(),
  creatorId: faker.random.uuid(),
  description: faker.random.words(),
  product: product(),
  unreadMessagesCount: faker.random.number(),
  createdBy: faker.random.uuid(),
  interlocutor: user(),

  messages: Array(Math.floor(Math.random() * 10)).fill(message()),
  lastMessage: message(),
});
export default chat;
