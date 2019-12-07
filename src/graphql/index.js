import { ApolloServer, MockList } from 'apollo-server';
import schema from './schema';
import logger from '../utils/logger';
import UserModel from '../models/user';
import product from '../mocks/product';

const mocks = {
  Query: () => ({
    products: () => new MockList(10),
  }),
  Product: () => product(),
};
const getTokenFromReq = req => {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').replace('Token ', '');
  return token;
};

const server = new ApolloServer({
  introspection: true,
  playground: true,
  schema,
  mocks,
  mockEntireSchema: true,
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
