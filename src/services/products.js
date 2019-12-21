/* eslint-disable class-methods-use-this */
import ProductModel from '../models/product';
import CategoryModel from '../models/category';

class ProductsService {
  async add({ creator, description, location, price, category, title }) {
    // TODO: validate   

    const ctg = await CategoryModel.findOneByQuery({ name: category.name })
    const categoryId = ctg._id

    return ProductModel.create({
      creatorId: creator._id,
      creator,
      description,
      location,
      price,
      category,
      categoryId,
      title,
      status: "PUBLISHED"
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

  update(productId, body) {
    // TODO: validate
    return ProductModel.update({ _id: productId }, { $set: { body } });
  }
}

export default new ProductsService();
