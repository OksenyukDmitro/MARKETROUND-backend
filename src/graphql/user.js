/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-server';
import AuthService from '../services/auth';

export const typeDefs = gql`
  extend type Query {
    me: User
    user(username: String!): User
  }

  extend type Mutation {
    createAccount(input: CreateAccountInput!): TokenAndUser!
    updateAccount(input: UpdateAccountInput!): User!
    login(input: LoginInput!): TokenAndUser!
    logout: Boolean
    changePassword(input: ChangePasswordInput!): Boolean
    forgotPassword(username: String!, email: String!, newPassword: String!): Boolean
    addToWish(productId: String!): Boolean
    removeFromWish(productId: String!): Boolean
  }

  input CreateAccountInput {
    username: String!
    email: String!
    password: String!
    profile: UserProfileInput
  }
  input UpdateAccountInput {
    username: String
    profile: UserProfileInput!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input ChangePasswordInput {
    password: String!
    newPassword: String!
  }

  input UserProfileInput {
    firstName: String!
    lastName: String!
    avatar: String
  }

  type TokenAndUser {
    user: User!
    token: String!
  }

  extend type Product {
    creator: User
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    profile: UserProfile!
    chatsId: [String]
    wish: [String]
  }

  type UserProfile {
    firstName: String!
    lastName: String!
    avatar: String
  }
`;

export const resolvers = {
  Query: {
    me: (root, args, context) => context.user,
    user: (root, args) => AuthService.findUserByUsername(args.username),
  },
  Mutation: {
    createAccount: async (root, args) => {
      const {
        input: { username, password, email, profile },
      } = args;
      const {
        accessToken: { token },
        user,
      } = await AuthService.createAccount(username, password, email, profile);
      return {
        token,
        user,
      };
    },
    updateAccount: async (root, args, ctx) => {
      const modifier = { ...args.input };
      const { _id, username } = ctx.user;
      const user = await AuthService.updateAccount(_id, username, modifier);
      return user;
    },
    login: async (root, args) => {
      const {
        input: { username, password },
      } = args;
      const {
        accessToken: { token },
        user,
      } = await AuthService.login(username, password);
      return {
        token,
        user,
      };
    },
    logout: async (root, args, ctx) => {
      await AuthService.logout(ctx.token);
      return null;
    },
    changePassword: async (root, args, ctx) => {
      const {
        input: { password, newPassword },
      } = args;
      const { nModified } = await AuthService.changePassword(ctx.user, password, newPassword);
      if (nModified > 0) return true;
      return false;
    },
    forgotPassword: async (root, args) => {
      const { username, email, newPassword } = args;
      const user = await AuthService.findUserByUsername(username);

      if (!user) {
        throw new Error('Username is not found');
      }

      if (user.email !== email) {
        throw new Error('Email does not match');
      }

      const { nModified } = await AuthService.changeForgotPassword(user, newPassword);
      if (nModified > 0) return true;
      return false;
    },
    addToWish: async (root, args, ctx) => {
      const { productId } = args;
      const result = await AuthService.addToWish(ctx.user, productId);
      return result;
    },
    removeFromWish: async (root, args, ctx) => {
      const { productId } = args;
      const result = await AuthService.removeFromWish(ctx.user, productId);
      return result;
    },
    //     changePassword
    // forgotPassword
  },
};
