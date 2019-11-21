import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please enter a description'],
    },
    createdBy: { type: 'ObjectId', ref: 'User' },
    location: {
      type: String,
      required: [true, 'Please enter a location'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price'],
    },
  },
  { timestamps: true },
);

ProductSchema.statics.findByUserId = function findPostByUserId(userId, options) {
  return this.findByQuery({ createdBy: userId }, options);
};
ProductSchema.statics.findByProductId = function findProductByProductId(_id) {
  return this.findOne({ _id })

};

ProductSchema.statics.findByQuery = function findByQuery(query, options) {
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(options.offset || 0)
    .limit(options.limit || 10);
};

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;
