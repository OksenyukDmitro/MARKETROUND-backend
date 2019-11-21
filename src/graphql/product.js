/* eslint-disable no-underscore-dangle */
import { gql } from 'apollo-server';
import ProductsService from '../services/products';
import { authCheck } from './utils';

export const typeDefs = gql`
  extend type Query {
    products(offset: Int!, limit: Int!): [Product]!
    myProducts(offset: Int!, limit: Int!): [Product]!
    product(productId: ID!): Product!
  }

  extend type Mutation {
    addProduct(description: String! location: String! price: Int!): Product!
    deleteProduct(productId: ID!): Boolean
    updateProduct(productId: ID!, body: String!): Product!
  }

  type Product {
    _id: ID!    
    location: String
    price: Int!
    createdAt: String!  
    category: String  
    creatorId: ID!  
    description: String!    
  }

  
`;

export const resolvers = {
  Query: {
    products: (root, args, ctx) => {
      authCheck(ctx);
      const { limit, offset } = args;
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
      const product = await ProductsService.findByProductId(productId)      
      return product
    },
  },
  Mutation: {
    addProduct: (root, args, ctx) => {
      authCheck(ctx);
      return ProductsService.add({
        createdBy: ctx.user._id, description: args.description,
        location: args.location, price: args.price
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
