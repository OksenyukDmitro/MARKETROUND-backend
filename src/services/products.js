/* eslint-disable class-methods-use-this */
import ProductModel from '../models/product';

class ProductsService {
  add({ createdBy, description, location, price }) {
    // TODO: validate
    return ProductModel.create({ createdBy, description, location, price });
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
