/* eslint-disable no-underscore-dangle */
import { gql } from 'apollo-server';
import ProductsService from '../services/products';
import { authCheck } from './utils';

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
    title: String!
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
      const { description, title, location, price, category } = args.input;
      return ProductsService.add({
        title,
        createdBy: ctx.user._id,
        description,
        location,
        price,
        category: {
          name: category.name,
        },
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
