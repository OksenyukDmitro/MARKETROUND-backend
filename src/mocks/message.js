import faker from 'faker';
import user from './user';

const message = () => ({
  _id: faker.random.uuid(),
  chatId: faker.random.uuid(),
  username: faker.random.word(),
  body: faker.random.words(),
  incoming: faker.random.boolean(),
  creator: user(),
  createdAt: faker.date.past(),
  createdBy: faker.random.uuid(),
});
export default message;
