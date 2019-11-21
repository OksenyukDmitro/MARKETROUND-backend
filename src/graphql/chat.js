/* eslint-disable no-underscore-dangle */
import { gql } from 'apollo-server';
import ChatsService from '../services/chats';
import ProductsService from '../services/products';
import { authCheck } from './utils';

export const typeDefs = gql`
  extend type Query {
    chats(offset: Int!, limit: Int!): [Chat]!
    chat(chatId: String!): Chat!
  }

  extend type Mutation {
    createChat(productId: String!): Chat!
    addMessage(chatId: String!, body: String!): Message!
  }

  type Chat {
    _id: ID!
    productId: ID!
    product: Product!
    messages: [Message]
    createdAt: String!
    createdBy: ID!
    unreadMessagesCount: Int!
    lastMessage: Message
    interlocutor: User!
  }

  type Message {
    chatId: ID!
    _id: ID!
    createdAt: String!
    body: String!
    incoming: Boolean!
    creator: User!
    createdBy: ID!
  }
`;

export const resolvers = {
  Query: {
    chat: (root, args, ctx) => {
      authCheck(ctx);
      const { chatId } = args;
      return ChatsService.findByChatId(chatId);
    },
    chats: (root, args, ctx) => {
      authCheck(ctx);
      const { limit, offset } = args;
      return ChatsService.find({ _id: ctx.user.chatsId }, { limit, offset });
    },
  },

  Mutation: {
    addMessage: (root, args, ctx) => {
      authCheck(ctx);
      return ChatsService.addMessage({
        createdBy: ctx.user._id,
        chatId: args.chatId,
        body: args.body,
      });
    },
    createChat: async (root, args, ctx) => {
      authCheck(ctx);
      const { createdBy } = await ProductsService.findByProductId(args.productId);

      return ChatsService.create({
        createdBy: ctx.user._id,
        productId: args.productId,
        productOwnerId: createdBy,
      });
    },
  },
  // TODO: implement
};
