/* eslint-disable no-underscore-dangle */
import { gql } from 'apollo-server';
import faker from 'faker';
import ProductsService from '../services/products';
import { authCheck } from './utils';

const randomArray = (min, max, callback) => {
  const size = faker.random.number({ min, max });
  return Array.from({ length: size }, callback);
};

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

export const typeDefs = gql`
  enum Status {
    DRAFT
    PUBLISHED
    CLOSED
  }
  extend type Query {
    products(offset: Int!, limit: Int!): [Product]!
    myProducts(offset: Int!, limit: Int!): [Product]!
    product(productId: ID!): Product!
  }

  extend type Mutation {
    addProduct(input: CreateProductInput!): Product!
    deleteProduct(productId: ID!): Boolean
    updateProduct(input: UpdateProductInput): Product!
  }

  input CreateProductInput {
    description: String!
    location: String!
    price: Float!
    category: CategoryInput!
    images: [ProductImageInput]
  }

  input UpdateProductInput {
    productId: ID!
    body: String!
    status: Status!
  }
  input CategoryInput {
    name: ID!
  }
  input ProductImageInput {
    url: String!
  }

  type Product {
    _id: ID!
    title: String!
    location: String
    price: Float!
    createdAt: String!
    category: Category!
    categoryId: ID!
    creatorId: ID!
    description: String!
    images: [ProductImage]
    status: Status!
  }
  type ProductImage {
    url: String!
  }

  type Category {
    _id: ID!
    name: ID!
    products: [Product]!
  }
`;

export const resolvers = {
  Query: {
    products: (root, args, ctx) => {
      const { limit, offset } = args;
      authCheck(ctx);

      return ProductsService.find({}, { limit, offset });
    },
    myProducts: (root, args, ctx) => {
      authCheck(ctx);
      const { limit, offset } = args;
      return ProductsService.findByUserId(ctx.user._id, { limit, offset });
    },
    product: async (root, args, ctx) => {
      authCheck(ctx);
      const { productId } = args;
      const product = await ProductsService.findByProductId(productId);
      return product;
    },
  },
  Mutation: {
    addProduct: (root, args, ctx) => {
      authCheck(ctx);
      return ProductsService.add({
        createdBy: ctx.user._id,
        description: args.description,
        location: args.location,
        price: args.price,
      });
    },
    deleteProduct: (root, args, ctx) => {
      authCheck(ctx);
      return ProductsService.remove(args.postId).then(result => result.ok);
    },
    updateProduct: (root, args, ctx) => {
      authCheck(ctx);
      return ProductsService.update(args.postId, args.body);
    },
  },
  // TODO: implement
};
export const mockResolvers = {
  Query: {
    products: (root, args) => {
      const { limit } = args;
      return randomArray(limit, limit, products);
    },
    myProducts: (root, args, ctx) => {
      authCheck(ctx);
      const { limit, offset } = args;
      return ProductsService.findByUserId(ctx.user._id, { limit, offset });
    },
    product: async (root, args, ctx) => {
      authCheck(ctx);
      const { productId } = args;
      const product = await ProductsService.findByProductId(productId);
      return product;
    },
  },
  Mutation: {
    addProduct: (root, args, ctx) => {
      authCheck(ctx);
      return ProductsService.add({
        createdBy: ctx.user._id,
        description: args.description,
        location: args.location,
        price: args.price,
      });
    },
    deleteProduct: (root, args, ctx) => {
      authCheck(ctx);
      return ProductsService.remove(args.postId).then(result => result.ok);
    },
    updateProduct: (root, args, ctx) => {
      authCheck(ctx);
      return ProductsService.update(args.postId, args.body);
    },
  },
  // TODO: implement
};
