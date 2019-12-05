import { ApolloServer, addMockFunctionsToSchema, MockList } from 'apollo-server';
import faker from 'faker';

import schema from './schema';
import logger from '../utils/logger';
import UserModel from '../models/user';

const products = () => ({
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
      url: faker.random.image(),
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
const mocks = {
  Query: () => ({
    products: () => new MockList(10),
  }),
  Product: () => products(),
};
const getTokenFromReq = req => {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').replace('Token ', '');
  return token;
};

addMockFunctionsToSchema({ schema, mocks });
const server = new ApolloServer({
  introspection: true,
  playground: true,
  schema,
  mocks,
  mockEntireSchema: false,
  context: async ({ req }) => {
    const token = getTokenFromReq(req);
    return {
      token,
      user: await UserModel.findByToken(token),
    };
  },
});

export default async () => {
  // The `listen` method launches a web server.
  const instance = await server.listen();
  const { url } = instance;
  logger.info(`🚀 Apollo Server ready at ${url}`);
};
