/* eslint-disable class-methods-use-this */
import ProductModel from '../models/product';
import CategoryModel from '../models/category';

class ProductsService {
  async add({ creator, description, location, price, category, title, images }) {
    // TODO: validate

    const ctg = await CategoryModel.findOneByQuery({ name: category.name });
    const categoryId = ctg._id;

    return ProductModel.create({
      creatorId: creator._id,
      creator,
      description,
      location,
      price,
      category,
      categoryId,
      title,
      status: 'PUBLISHED',
      images,
    });
  }

  find(query = {}, options) {
    return ProductModel.findByQuery(query, options);
  }

  findByUserId(_id, options) {
    return ProductModel.findByUserId(_id, options);
  }

  findByProductId(_id) {
    return ProductModel.findByProductId(_id);
  }

  remove(_id) {
    // TODO: validate
    return ProductModel.remove({ _id });
  }

  async update(productId, status) {
    const { nModified } = await ProductModel.updateOne({ _id: productId }, { $set: { status } });
    return nModified;
  }
}

export default new ProductsService();
