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
    creator: User!
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
    chat: async (root, args, ctx) => {
      authCheck(ctx);
      const { chatId } = args;
      const chat = await ChatsService.findByChatId(chatId);
      if (chat) {
        chat.messages.sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
      }
      return chat;
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
        creator: ctx.user,
        chatId: args.chatId,
        body: args.body,
      });
    },
    createChat: async (root, args, ctx) => {
      authCheck(ctx);
      const { creatorId } = await ProductsService.findByProductId(args.productId);
      const { user } = ctx;
      if (creatorId == user._id) {
        throw new Error('You cannot create chat with yourself');
      }
      const chat = await ChatsService.findOne({
        createdBy: user._id,
        productId: args.productId,
        productOwnerId: creatorId,
      });

      if (chat) {
        return chat;
      }
      return ChatsService.create({
        createdBy: user._id,
        productId: args.productId,
        productOwnerId: creatorId,
      });
    },
  },
  // TODO: implement
};
