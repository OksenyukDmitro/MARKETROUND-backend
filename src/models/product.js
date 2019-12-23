import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a title'],
    },
    creatorId: {
      type: String,
      required: [true, 'Please enter a creatorId'],
    },
    description: {
      type: String,
      required: [true, 'Please enter a description'],
    },
    creator: { type: 'ObjectId', ref: 'User' },
    location: {
      type: String,     
    },
    categoryId: {
      type: String,
      required: [true, 'Please enter a categoryId'],
    },
    category: {
      name: {
        type: String,
        required: [true, 'Please enter a category'],
      },
    },
   
    price: {
      type: Number,
      required: [true, 'Please enter a price'],
    },
    status: {
      type: String,
      required: [true, 'Please enter a status'],
    },
    images: {
      type: Array,     
    },
  },
  { timestamps: true },
);

ProductSchema.statics.findByUserId = function findPostByUserId(userId, options) {
  return this.findByQuery({ creatorId: userId }, options);
};

ProductSchema.statics.findByProductId = function findProductByProductId(_id) {
  return this.findOne({ _id }).populate('creator');
};

ProductSchema.statics.findByQuery = function findByQuery(query, options) {
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(options.offset || 0)
    .limit(options.limit || 10)
    .populate('creator');
};

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;
