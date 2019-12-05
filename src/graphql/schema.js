import { gql, makeExecutableSchema } from 'apollo-server';
import merge from 'lodash/merge';
import { typeDefs as Product, resolvers as productResolvers } from './product';
import { typeDefs as User, resolvers as userResolvers } from './user';
import { typeDefs as Chat, resolvers as chatResolvers } from './chat';

const Common = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [Common, User, Product, Chat],
  resolvers: merge(userResolvers, productResolvers, chatResolvers),
});

export default schema;
