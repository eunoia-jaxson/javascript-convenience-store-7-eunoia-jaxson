// ProductConverter.js
import Product from './Product.js';

class ProductConverter {
  convertProductList(rawProducts) {
    const products = rawProducts.map((product) => {
      const [name, unitPrice, stockQuantity, promotion] = product.split(',');
      if (promotion === 'null') {
        return new Product(name, Number(unitPrice), Number(stockQuantity), '');
      }
      return new Product(name, Number(unitPrice), Number(stockQuantity), promotion);
    });

    return this.outOfStock(products);
  }

  outOfStock(products) {
    products.forEach((product, index) => {
      if (
        products[index + 1] &&
        product.getName() !== products[index + 1].getName() &&
        product.getPromotion() !== ''
      ) {
        this.spliceArray(products, index, product);
      }
    });
    return products;
  }

  spliceArray(products, index, product) {
    products.splice(index + 1, 0, new Product(product.getName(), product.getUnitPrice(), 0, ''));
  }
}

export default new ProductConverter();
