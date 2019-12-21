import faker from 'faker';

const user = () => ({
  _id: faker.random.uuid(),
  username: faker.random.word(),
  wish: Array(Math.floor(Math.random() * 10)).fill(faker.random.uuid()),
  profile: {
    firstName: faker.random.word(),
    lastName: faker.random.word(),
    avatar: faker.internet.avatar(),
  },
});
export default user;
