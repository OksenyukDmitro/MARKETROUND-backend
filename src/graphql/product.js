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
    seacrhProducts(offset: Int!, limit: Int!, category: String, seacrhQuery: String): [Product]!
    userProducts(userId: String!, offset: Int!, limit: Int!): [Product]!
    myProducts(offset: Int!, limit: Int!): [Product]!
    product(productId: ID!): Product!
    wishProducts(offset: Int!, limit: Int!): [Product]!
  }

  extend type Mutation {
    addProduct(input: CreateProductInput!): Product!
    deleteProduct(productId: ID!): Boolean
    updateProduct(input: UpdateProductInput): Product!
  }

  input CreateProductInput {
    title: String!
    description: String!
    location: String
    price: Float!
    category: CategoryInput!
    images: [ProductImageInput]
  }

  input UpdateProductInput {
    productId: ID!
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
    products: (root, args) => {
      const { limit, offset } = args;

      return ProductsService.find({}, { limit, offset });
    },
    seacrhProducts: (root, args) => {
      const { limit, offset, category, seacrhQuery } = args;
      if (category && category !== '' && seacrhQuery && seacrhQuery !== '') {
        return ProductsService.find(
          {
            category: { name: category },
            title: { $regex: seacrhQuery, $options: 'i' },
          },
          { limit, offset },
        );
      }
      if (category && category !== '') {
        return ProductsService.find({ category: { name: category } }, { limit, offset });
      }
      if (seacrhQuery && seacrhQuery !== '') {
        return ProductsService.find({ title: { $regex: seacrhQuery, $options: 'i' } }, { limit, offset });
      }

      return ProductsService.find({}, { limit, offset });
    },
    wishProducts: (root, args, ctx) => {
      const { limit, offset } = args;
      authCheck(ctx);
      const wish = [];
      ctx.user.wish.forEach(element => {
        wish.push(ProductsService.findByProductId({ _id: element }, { limit, offset }));
      });

      return wish;
    },
    myProducts: (root, args, ctx) => {
      authCheck(ctx);
      const { limit, offset } = args;
      return ProductsService.findByUserId(ctx.user._id, { limit, offset });
    },
    userProducts: (root, args) => {
      const { limit, offset, userId } = args;
      return ProductsService.findByUserId(userId, { limit, offset });
    },
    product: async (root, args) => {
      const { productId } = args;
      const product = await ProductsService.findByProductId(productId);
      return product;
    },
  },
  Mutation: {
    addProduct: (root, args, ctx) => {
      authCheck(ctx);
      const { description, title, location, price, category, images } = args.input;
      console.log(images);
      return ProductsService.add({
        title,
        creator: ctx.user,
        description,
        location,
        price,
        images,
        category: {
          name: category.name,
        },
      });
    },
    deleteProduct: (root, args, ctx) => {
      authCheck(ctx);
      return ProductsService.remove(args.postId).then(result => result.ok);
    },
    updateProduct: async (root, args, ctx) => {
      authCheck(ctx);
      const { productId, status } = args.input;
      await ProductsService.update(productId, status);
      return ProductsService.findByProductId(productId);
    },
  },
  // TODO: implement
};
