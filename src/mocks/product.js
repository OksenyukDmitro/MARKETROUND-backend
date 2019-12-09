import faker from 'faker';
import user from './user';

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

  creator: user(),
});
export default product;
