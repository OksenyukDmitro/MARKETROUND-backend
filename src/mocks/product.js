import faker from 'faker';

const product = () => ({
  _id: faker.random.uuid(),
  location: faker.address.city(),
  title: faker.random.words(),
  price: faker.commerce.price(),
  createdAt: faker.date.past(),
  categoryId: faker.random.uuid(),
  creatorId: faker.random.uuid(),
  description: faker.random.words(),
  category: {
    name: faker.random.words(),
  },
  images: [
    {
      url: faker.internet.avatar(),
    },
  ],

  creator: {
    _id: faker.random.uuid(),
    username: faker.random.word(),

    profile: {
      firstName: faker.random.word(),
      lastName: faker.random.word(),
      avatar: faker.internet.avatar(),
    },
  },
});
export default product;
